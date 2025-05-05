async function getData() {
    const response = await fetch("http://127.0.0.1:8000/api/asset");

    if (!response.ok) {
        throw new Error("Failed to get response")
    }

    const data = await response.json();

    return data;
}

function Test() {
    return (
        <div>
            
        </div>
    )
}