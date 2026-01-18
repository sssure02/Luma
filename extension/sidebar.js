document.getElementById("analyze").onclick = async () => {
  const text = document.getElementById("input").value;

  const res = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await res.json();

  document.getElementById("explanation").innerText = data.explanation;
  document.getElementById("rewrite").innerText = data.rewrite;
};
