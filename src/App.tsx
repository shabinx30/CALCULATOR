import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { buttons } from "./libs/buttons";

const App = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [resultHeight, setResultHeight] = useState(200);
    const [input, setInput] = useState("");
    const [fastResult, setFastResult] = useState("");

    const handleDrag = (_: unknown, info: { delta: { y: number } }) => {
        if (!containerRef.current) return;
        const newHeight = Math.min(
            Math.max(resultHeight + info.delta.y, 200),
            375
        );
        setResultHeight(newHeight);
    };

    const handleInput = (value: string | boolean) => {
        // checking if it's actually an operator or num
        if (value === false) {
            return setInput((p) => p.slice(0, p.length - 1));
        }

        // checking if it's num
        value = String(value);
        if (!isNaN(parseInt(value))) {
            setInput((p) => {
                let nums = p.split(/[+×÷.-]/g);
                // relaplacing 0 with num
                if (parseInt(nums[nums.length - 1]) == 0) {
                    return p.slice(0, p.length - 1) + value;
                }
                return p + value;
            });
        }

        // checking if it's an operator
        if (value.match(/[+×÷.-]/g)) {
            // replacing operators with another
            setInput((p) => {
                const last = p[p.length - 1];
                if (last && last.match(/[+×÷.-]/g)) {
                    return p.slice(0, input.length - 1) + value;
                }
                return p + value;
            });
        }

        // clear the result section
        if (value === "AC") {
            setFastResult("");
            return setInput("");
        }

        // calculate the result
        if (value === "=") {
            calc();
        }
    };

    const calc = () => {
        setFastResult("");
        setInput((p) => {
            const exe = p.replaceAll("×", "*").replaceAll("÷", "/");
            if (/^[0-9+\-*/().\s]+$/.test(exe)) {
                return String(new Function(`return ${exe}`)());
            } else {
                return "Invalid input";
            }
        });
    };

    // for showing the quick results
    useEffect(() => {
        if (input) {
            const nums = input.split(/[+×÷.-]/g);
            if (nums.length > 1 && nums[nums.length - 1]) {
                const exe = input.replaceAll("×", "*").replaceAll("÷", "/");
                if (/^[0-9+\-*/().\s]+$/.test(exe)) {
                    setFastResult(String(new Function(`return ${exe}`)()));
                }
            } else {
                setFastResult("");
            }
        }
    }, [input]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            const { key } = e;
            if (key.toLowerCase() === "x" || key === "*") {
                return handleInput("×");
            } else if (key === "/") {
                return handleInput("÷");
            } else if (/^[0-9+\-*/().\s]+$/.test(key)) {
                return handleInput(key);
            } else if (key === "Backspace" || key === "Delete") {
                return setInput((p) => p.slice(0, p.length - 1));
            } else if (key === "Enter" || key === "=") {
                return calc();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="h-[100dvh] w-screen flex justify-center"
        >
            <main className="w-full flex flex-col md:w-[460px] h-full">
                {/* result section */}
                <section
                    className="overflow-auto"
                    style={{ height: `${resultHeight}px` }}
                >
                    <div className="min-h-[10em] flex flex-col items-end p-4">
                        {/* result goes here */}
                        <p className="text-5xl font-semibold">{input}</p>
                        <p className="text-4xl text-gray-500">{fastResult}</p>
                    </div>
                </section>

                {/* draggable pill */}
                <motion.div
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDrag={handleDrag}
                    dragElastic={false}
                    dragTransition={{
                        power: 0,
                        bounceStiffness: 1000,
                        bounceDamping: 1000,
                    }}
                    className="h-4 mb-2 flex justify-center items-center cursor-row-resize"
                >
                    <div className="w-10 h-1.5 bg-gray-400 rounded-full" />
                </motion.div>

                {/* button section */}
                <section className="flex-1 flex flex-col overflow-hidden">
                    {/* upper buttons */}
                    <div className="flex gap-2 pb-2 h-[5em]">
                        <div
                            onClick={() => handleInput("AC")}
                            className="flex-1/2 flex justify-center items-center bg-[#e0e0e0] text-black select-non text-[1.8em] rounded-full cursor-pointer"
                        >
                            AC
                        </div>
                        <div
                            onClick={() => handleInput("÷")}
                            className="flex-1 flex justify-center items-center bg-[#e0e0e0] text-black select-non text-[2.2em] aspect-square rounded-full cursor-pointer"
                        >
                            ÷
                        </div>
                    </div>

                    {/* keypad */}
                    <div className="grid grid-cols-4 gap-2 font-semibold flex-1 overflow-auto">
                        {buttons.map((item, i) => (
                            <div
                                onClick={() =>
                                    handleInput(
                                        typeof item.icon === "string" &&
                                            item.icon
                                    )
                                }
                                key={i}
                                className={`${
                                    item.isOper
                                        ? "flex justify-center items-center rounded-full cursor-pointer bg-[#e0e0e0] text-black select-none text-[1.8em]"
                                        : item.isDelete
                                        ? "flex justify-center items-center rounded-full cursor-pointer bg-red-400 text-black select-none text-[1.8em]"
                                        : "flex justify-center items-center rounded-full cursor-pointer bg-[#1b1b1b] select-none text-[1.8em]"
                                }`}
                            >
                                {item.icon}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default App;
