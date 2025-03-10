from flask import Flask, request
from flask_cors import CORS

from arango import ArangoClient
from langchain.graphs import ArangoGraph
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import ArangoGraphQAChain
from langchain.prompts import PromptTemplate
import cudf
import cugraph
from langchain.agents import AgentType, initialize_agent
from langchain.tools import Tool
import os

os.environ["GOOGLE_API_KEY"] = "AIzaSyBtPCFi5mDxqmuc6Up181kK6koH4ZBEqgM"

model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)


print("Connecting to ArangoDB...")
client = ArangoClient(hosts="https://bb521baee078.arangodb.cloud:8529")
db = client.db("cve_dataset", username="root", password="hxsg2775gK1WCyHvCBw7")
print("ArangoDB version:", db.version())



graph = ArangoGraph(db)

graph.schema

chain = ArangoGraphQAChain.from_llm(model, graph=graph, verbose=True, allow_dangerous_requests=True)
from adbcug_adapter import ADBCUG_Adapter

# Use ADBCUG_Adapter as needed
adbcug_adapter = ADBCUG_Adapter(db)

def get_controller():
    from adbcug_adapter import ADBCUG_Controller
    return ADBCUG_Controller()

# When you need to use the controller, call get_controller()
controller = get_controller()
adbcug_adapter = ADBCUG_Adapter(db)
import networkx as nx

# Define the names of the edge collections
EDGE_COLLECTIONS = ["vendor_cve", "product_vendor", "product_cve"]  # Replace with actual names

# Create a directed NetworkX graph (use nx.Graph() if undirected)
nx_g = nx.DiGraph()

# Loop through each edge collection and add edges to the NetworkX graph
for edge_collection in EDGE_COLLECTIONS:
    aql_query = f"FOR edge IN {edge_collection} RETURN edge"
    edges = list(db.aql.execute(aql_query))
    
    for edge in edges:
        nx_g.add_edge(edge["_from"], edge["_to"])

# Print NetworkX graph info
print(nx_g)

# Convert NetworkX graph to pandas edgelist
edge_list_df = nx.to_pandas_edgelist(nx_g)

# Convert pandas DataFrame to cuDF DataFrame
edge_list_cudf = cudf.DataFrame(edge_list_df)

# Rename columns for cuGraph compatibility
edge_list_cudf = edge_list_cudf.rename(columns={"source": "src", "target": "dst"})

# Create cuGraph Graph
cug_g = cugraph.Graph(directed=True)  # Change to `cugraph.Graph()` for undirected

# Load edges into cuGraph from cuDF DataFrame
cug_g.from_cudf_edgelist(edge_list_cudf, source="src", destination="dst")

# Print cuGraph info
print("cuGraph Graph created with", cug_g.number_of_edges(), "edges.")

AQL_GENERATION_TEMPLATE = """Task: Generate an ArangoDB Query Language (AQL) query from a User Input.

You are an ArangoDB Query Language (AQL) expert responsible for translating a `User Input` into an ArangoDB Query Language (AQL) query.

You are given an `ArangoDB Schema`. It is a JSON Object containing:
1. `Graph Schema`: Lists all Graphs within the ArangoDB Database Instance, along with their Edge Relationships.
2. `Collection Schema`: Lists all Collections within the ArangoDB Database Instance, along with their document/edge properties and a document/edge example.

You may also be given a set of `AQL Query Examples` to help you create the `AQL Query`. If provided, the `AQL Query Examples` should be used as a reference, similar to how `ArangoDB Schema` should be used.

Things you should do:
- Think step by step.
- Rely on `ArangoDB Schema` and `AQL Query Examples` (if provided) to generate the query.
- Begin the `AQL Query` by the `WITH` AQL keyword to specify all of the ArangoDB Collections required.
- Return the `AQL Query` wrapped in 3 backticks (```).
- Use only the provided relationship types and properties in the `ArangoDB Schema` and any `AQL Query Examples` queries.
- Only answer to requests related to generating an AQL Query.
- If a request is unrelated to generating AQL Query, say that you cannot help the user.

Things you should not do:
- Do not use any properties/relationships that can't be inferred from the `ArangoDB Schema` or the `AQL Query Examples`.
- Do not include any text except the generated AQL Query.
- Do not provide explanations or apologies in your responses.
- Do not generate an AQL Query that removes or deletes any data.

Under no circumstance should you generate an AQL Query that deletes any data whatsoever.

ArangoDB Schema:
{adb_schema}

AQL Query Examples (Optional):
{aql_examples}

User Input:
{user_input}

AQL Query:
"""

AQL_GENERATION_PROMPT = PromptTemplate(
    input_variables=["adb_schema", "aql_examples", "user_input"],
    template=AQL_GENERATION_TEMPLATE,
)
AQL_FIX_TEMPLATE = """Task: Address the ArangoDB Query Language (AQL) error message of an ArangoDB Query Language query.

You are an ArangoDB Query Language (AQL) expert responsible for correcting the provided `AQL Query` based on the provided `AQL Error`.

The `AQL Error` explains why the `AQL Query` could not be executed in the database.
The `AQL Error` may also contain the position of the error relative to the total number of lines of the `AQL Query`.
For example, 'error X at position 2:5' denotes that the error X occurs on line 2, column 5 of the `AQL Query`.

You are also given the `ArangoDB Schema`. It is a JSON Object containing:
1. `Graph Schema`: Lists all Graphs within the ArangoDB Database Instance, along with their Edge Relationships.
2. `Collection Schema`: Lists all Collections within the ArangoDB Database Instance, along with their document/edge properties and a document/edge example.

You will output the `Corrected AQL Query` wrapped in 3 backticks (```). Do not include any text except the Corrected AQL Query.

Remember to think step by step.

ArangoDB Schema:
{adb_schema}

AQL Query:
{aql_query}

AQL Error:
{aql_error}

Corrected AQL Query:
"""

AQL_FIX_PROMPT = PromptTemplate(
    input_variables=["adb_schema", "aql_query", "aql_error"],
    template=AQL_FIX_TEMPLATE,
)
AQL_QA_TEMPLATE = """Task: Generate a natural language `Summary` from the results of an ArangoDB Query Language query.

You are an ArangoDB Query Language (AQL) expert responsible for creating a well-written `Summary` from the `User Input` and associated `AQL Result`.

A user has executed an ArangoDB Query Language query, which has returned the AQL Result in JSON format.
You are responsible for creating an `Summary` based on the AQL Result.

You are given the following information:
- `ArangoDB Schema`: contains a schema representation of the user's ArangoDB Database.
- `User Input`: the original question/request of the user, which has been translated into an AQL Query.
- `AQL Query`: the AQL equivalent of the `User Input`, translated by another AI Model. Should you deem it to be incorrect, suggest a different AQL Query.
- `AQL Result`: the JSON output returned by executing the `AQL Query` within the ArangoDB Database.

Remember to think step by step.

Your `Summary` should sound like it is a response to the `User Input`.
Your `Summary` should not include any mention of the `AQL Query` or the `AQL Result`.

ArangoDB Schema:
{adb_schema}

User Input:
{user_input}

AQL Query:
{aql_query}

AQL Result:
{aql_result}
"""

AQL_QA_PROMPT = PromptTemplate(
    input_variables=["adb_schema", "user_input", "aql_query", "aql_result"],
    template=AQL_QA_TEMPLATE,
)
aql_examples = """
Example 1:
WITH vendor, cve, vendor_cve

LET vendorPageRank = (
  FOR v IN vendor
  LET pageRank = (
    FOR vc IN vendor_cve
      FILTER vc._from == v._id
      COLLECT AGGREGATE count = COUNT(vc)
      RETURN count
  )[0]
  RETURN {vendor: v, pageRank: pageRank}
)

LET topVendors = (
  FOR item IN vendorPageRank
  SORT item.pageRank DESC
  LIMIT 5
  RETURN item.vendor
)

FOR vendor IN topVendors
  LET relatedCVEs = (
    FOR v, e, p IN 1..1 OUTBOUND vendor vendor_cve
    LIMIT 3
    RETURN v
  )
  RETURN {
    vendor: vendor,
    relatedCVEs: relatedCVEs
  }

Example 2:
WITH product, cve, product_cve

LET productVulnerabilityCounts = (
  FOR p IN product
  LET vulnerabilityCount = (
    FOR pc IN product_cve
    FILTER pc._from == p._id
    COLLECT AGGREGATE count = COUNT(pc)
    RETURN count
  )[0]
  RETURN { product: p, vulnerabilityCount: vulnerabilityCount }
)

LET topProducts = (
  FOR item IN productVulnerabilityCounts
  SORT item.vulnerabilityCount DESC
  LIMIT 5
  RETURN item.product
)

FOR prod IN topProducts
  LET relatedCVEs = (
    FOR p, e, v IN 1..1 OUTBOUND prod product_cve
    LIMIT 3  // Limit to 3 related CVEs per product to reduce result size
    RETURN v
  )
  RETURN {
    product: prod,
    relatedCVEs: relatedCVEs
  }

Example 3:
WITH vendor, cve, vendor_cve

LET vendorVulnerabilityCounts = (
  FOR v IN vendor
  LET vulnerabilityCount = (
    FOR vc IN vendor_cve
    FILTER vc._from == v._id
    COLLECT AGGREGATE count = COUNT(vc)
    RETURN count
  )[0]
  RETURN { vendor: v, vulnerabilityCount: vulnerabilityCount }
)

LET topVendors = (
  FOR item IN vendorVulnerabilityCounts
  SORT item.vulnerabilityCount DESC
  LIMIT 5  // Limit to top 5 vendors
  RETURN item.vendor
)

FOR vendor IN topVendors
  LET relatedCVEs = (
    FOR v, e, cv IN 1..1 OUTBOUND vendor vendor_cve
    LIMIT 3  // Limit to 3 related CVEs per vendor
    RETURN cv
  )
  RETURN {
    vendor: vendor,
    relatedCVEs: relatedCVEs
  }
"""
better_chain = ArangoGraphQAChain.from_llm(
    model,
    aql_generation_prompt=AQL_GENERATION_PROMPT,  # No change from original
    aql_fix_prompt=AQL_FIX_PROMPT,  # No change from original
    qa_prompt=AQL_QA_PROMPT,  # Use this prompt with examples
    graph=graph,
    verbose=True,
    allow_dangerous_requests=True,
)

def query_arangodb(query: str):
    """Executes a query on the ArangoDB database and returns results."""
    return better_chain.invoke({"query": query})  # Assuming better_chain is set up for querying

arangodb_tool = Tool(
    name="ArangoDB Query",
    func=query_arangodb,
    description="Use this tool to query the ArangoDB database for CVE-related insights."
)

# Define cuGraph Analysis Function
def run_cugraph_analysis(task: str):
    """Executes graph analysis using cuGraph, such as PageRank or shortest path."""
    if task.lower() == "pagerank":
        return "Running PageRank algorithm on the CVE graph... (Results here)"
    elif task.lower() == "shortest path":
        return "Computing shortest path in the CVE graph... (Results here)"
    else:
        return "Unsupported task. Available tasks: PageRank, Shortest Path."

cugraph_tool = Tool(
    name="cuGraph Analysis",
    func=run_cugraph_analysis,
    description="Use this tool to perform graph analysis like PageRank or Shortest Path on the CVE dataset."
)

def hybrid_query_execution(user_query):
    """
    Executes a hybrid query combining the BetterChain AQL traversal with cuGraph analytics for contextual responses.
    """
    # Step 1: Execute AQL query using BetterChain
    aql_results = better_chain.run(user_query)  # Uses BetterChain for optimized AQL execution

    if not aql_results:
        return "No relevant data found in the CVE graph."

    # Step 2: Run PageRank on existing cuGraph graph (cug_g)
    pagerank_df = cugraph.pagerank(cug_g)
    top_connections = pagerank_df.sort_values('pagerank', ascending=False).head(5)  # Get top 5

    # Step 3: Generate Dynamic Response using the Agent's LLM
    HYBRID_QUERY_PROMPT_TEMPLATE = """
You are an AI assistant specializing in cybersecurity and graph analysis. Based on the provided structured data, generate a concise, informative, and well-structured response.

### **Context:**
You have received a query regarding cybersecurity vulnerabilities, vendors, or products. The system has executed:
1. **AQL Query (BetterChain)**: Extracted relevant data from the ArangoDB CVE graph.
2. **Graph Analytics (cuGraph/PageRank)**: Ranked vendors based on influence and severity.

### **Results:**
{graph_analysis_results}

### **Instructions:**
- Present key findings in **natural language**.
- Prioritize critical insights (e.g., highest PageRank scores, severe CVEs).
- If applicable, mention specific **vendors, products, or CVEs** and their relevance.
- Keep responses **concise, factual, and structured**.

Now, generate the best possible response based on the available data.
"""
    prompt = PromptTemplate(
        input_variables=["graph_analysis_results"],
        template=HYBRID_QUERY_PROMPT_TEMPLATE
    )
    response = model.invoke(prompt.format(graph_analysis_results=top_connections.to_dict()))

    return response



# Define as a tool for agent
hybrid_query_tool = Tool(
    name="Hybrid Graph Query",
    description="Combines ArangoDB AQL and cuGraph analytics to generate natural language insights.",
    func=hybrid_query_execution
)

# Initialize the agent
agent = initialize_agent(
    tools=[arangodb_tool, cugraph_tool, hybrid_query_tool],
    llm=model,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    handle_parsing_errors=True
)



def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    app.app_context().push()
    return app

app = create_app()

def get_model_response(user_input):
    return agent.run(user_input)

@app.post("/api/v1/chat")
def chat():
    req = request.json
    user_input = req.get("user_input", "")
    
    if not user_input:
        return {"model_response": ""}, 200
    
    model_response = get_model_response(user_input)
    return {"model_response": model_response}, 200

if __name__ == "__main__":
    app.run()
