import ItemFilter from "../components/ItemFilter";
import { AssetFilterContextProvider, useFilterContext } from "../context/ItemFilterContext";

function FindAssetPage() {
    
    return (
        <AssetFilterContextProvider>
            <div>
                <ItemFilter />
                <ResultBox />
            </div>
        </AssetFilterContextProvider>
    )
}

function ResultBox() {
    const { query } = useFilterContext();
    
    if (query.isLoading) {
        return <p>Loading...</p>
    }

    if (query.isError) {
        return <p>
            Error: { query.error?.message || "Something went wrong." }
        </p>
    }

    return (
        <div>
            {
                query.isSuccess && (
                    <pre>
                        {JSON.stringify(query.data, null, 2)}
                    </pre>
                )
            }
        </div>
    )
}

export default FindAssetPage;