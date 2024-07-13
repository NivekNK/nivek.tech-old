import { createLazyFileRoute } from "@tanstack/react-router";
import images from "@/assets/images.json";
import "@/styles/font.css";

export const Route = createLazyFileRoute("/")({
    component: Index,
});

export function Index() {
    const flowers = images.flowers.sort(() => 0.5 - Math.random());

    return (
        <div className="flex-1 flex flex-col grow min-h-0">
            <hr className="mt-5 w-full border-t-2 border-[#655e53]" />
            <div className="flex h-full justify-between">
                <hr className="ml-16 h-full border-l-2 border-[#655e53]" />
                <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    <div className="ml-7 my-7 flex flex-col place-content-between">
                        <div>
                            <div className="space-y-5">
                                <h2 className="flex playfair-display-bold text-7xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-9xl">
                                    Kevin
                                </h2>
                                <div className="flex">
                                    <h1 className="playfair-display-normal text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl">
                                        Rojas
                                    </h1>
                                    <span
                                        className="mt-3 h-auto bg-[#cecac3] inline-block"
                                        style={{
                                            width: "2px",
                                            animation: "blink 1s step-start infinite",
                                        }}
                                    ></span>
                                </div>
                            </div>
                            <hr className="mt-14 w-1/2 border-t-2 border-[#cecac3]" />
                        </div>
                        <p className="pr-5">Consultor, desarrollador para resolver todo tipo de problemas.</p>
                    </div>
                    <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 bg-[#1c1f20]">
                        <div className="image-grid" style={{ '--grid-size': Math.ceil(Math.sqrt(flowers.length)) } as React.CSSProperties}>
                            {flowers.map((src, index) => (
                                <div key={index} className="image-cell">
                                    <img src={src} alt={`Image ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <hr className="mr-16 h-full border-r-2 border-[#655e53]" />
            </div>
            <hr className="pb-10 w-full border-t-2 border-[#655e53]" />
        </div>
    );
}
