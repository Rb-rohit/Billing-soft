import { forwardRef, useEffect, useRef, useState } from "react";

const ProductSearch = forwardRef(({ products, addToCart }, externalRef) => {
    const [query, setQuery] = useState("");
    const internalRef = useRef(null);
    const inputRef = externalRef || internalRef;
    
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const listRef = useRef(null);

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (filtered.length > 0) {
            setHighlightIndex(0);
        } else {
            setHighlightIndex(-1);
        }
    }, [query])

    useEffect(() => {
        if (highlightIndex >= 0 && listRef.current) {
            const item = listRef.current.children[highlightIndex];
            item?.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        } 
    }, [highlightIndex]);

    // barcode handler 
    const handleBarcodeScan = (e) => {
        if (!filtered.length && e.key !== "Enter") return;

        // arrow down
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex(prev => 
                prev < filtered.length - 1 ? prev + 1 : 0
            );
        }

        // arrow up
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex(prev => 
                prev > 0 ? prev - 1 : filtered.length - 1
            );
        }

        //enter
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();

            let product;

            // if nvigating list
            if (filtered.length === 1) {
                product = filtered[0];
            }else if (highlightIndex >= 0) {
                product = filtered[highlightIndex];
            } else {
                product = products.find(p => p.barcode === query);
            }

            if (product) {
                addToCart(product);
            } else {
                alert("Product not found");
            }

            setQuery("");
            setHighlightIndex(-1);

            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);

        }
    };

    return (
        <div>
            <input 
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleBarcodeScan}
                className="w-full border p-3 rounded-lg mb-3"
            />
            {query && (
                <div 
                    ref={listRef}
                    className="max-h-60 overflow-y-auto border rounded-lg" 
                >
                    {filtered.map((product, index) => (
                        <div
                            key={product._id}
                            onClick={() => {
                                addToCart(product);
                                setQuery("");
                                setHighlightIndex(-1);
                                inputRef.current?.focus();
                            }}
                            className={`p-2 cursor-pointer ${highlightIndex === index
                                ? "bg-blue-200"
                                : "hover:bg-gray-100"
                            }`}
                        >
                            {product.name} - ₹{product.price}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default ProductSearch;