import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { buttons } from "./libs/buttons";

const App = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [resultHeight, setResultHeight] = useState(200);
    const [input, setInput] = useState("");

    const handleDrag = (_: unknown, info: { delta: { y: number } }) => {
        if (!containerRef.current) return;
        const newHeight = Math.min(
            Math.max(resultHeight + info.delta.y, 200),
            375
        );
        setResultHeight(newHeight);
    };

    const handleInput = (value: string | boolean) => {
        if (value === false) {
            return setInput((p) => p.slice(0, p.length - 1));
        }

        value = String(value);
        if (!isNaN(parseInt(value))) {
            return setInput((p) => {
                let nums = p.split(/[+×÷.-]/g);
                if (parseInt(nums[nums.length - 1]) == 0) {
                    return p.slice(0, p.length - 1) + value;
                }
                return p + value;
            });
        }

        if (value.match(/[+×÷.-]/g)) {
            if (input[input.length - 1].match(/[+×÷.-]/g)) {
                return setInput((p) => p.slice(0, input.length - 1) + value);
            }
            return setInput((p) => p + value);
        }

        if (value === "AC") {
            return setInput("");
        }
        if (value === "=") {
            let exe = input.replaceAll("×", "*").replaceAll("÷", "/");
            return setInput(String(eval(exe)));
        }
    };

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
                    <div className="min-h-[10em] flex justify-end p-4">
                        {/* Content goes here */}
                        <p className="text-4xl font-semibold">{input}</p>
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
                            className="flex-1/2 flex justify-center items-center c-btn text-[1.8em] rounded-full"
                        >
                            AC
                        </div>
                        <div
                            onClick={() => handleInput("÷")}
                            className="flex-1 flex justify-center items-center c-btn text-[2.2em] aspect-square rounded-full"
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
                                        typeof item === "string" && item
                                    )
                                }
                                key={i}
                                className="flex justify-center items-center rounded-full c-btn text-[1.8em]"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default App;
