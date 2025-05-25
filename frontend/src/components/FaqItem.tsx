import { useState, useRef, useLayoutEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import "./FaqItem.css";

interface FaqItemProps {
    question: string;
    answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
    const [opened, setOpened] = useState(false);
    const [height, setHeight] = useState<string | undefined>(undefined);
    const questionRef = useRef<HTMLDivElement>(null);
    const answerRef = useRef<HTMLDivElement>(null);
    const faqRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (faqRef.current && questionRef.current && answerRef.current) {
            if (opened) {
                // Calculate total height: question + answer + paddings
                const questionHeight = questionRef.current.scrollHeight;
                const answerHeight = answerRef.current.scrollHeight;
                // Add some padding for aesthetics
                const padding = 10; // Adjust as needed
                setHeight(`${questionHeight + answerHeight + padding}px`);
            } else {
                // Only question visible
                const questionHeight = questionRef.current.scrollHeight;
                setHeight(`${questionHeight}px`);
            }
        }
    }, [opened, question, answer]);

    const handleClick = () => {
        setOpened((prev) => !prev);
    };

    return (
        <div
            className={`faq${opened ? " opened" : ""}`}
            onClick={handleClick}
            ref={faqRef}
            style={{
                height: height,
            }}
        >
            <div className="question" ref={questionRef}>
                <FontAwesomeIcon
                    icon={faArrowDown}
                    className="i"
                    style={{
                        transform: opened ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s"
                    }}
                />
                {question}
            </div>
            <div
                className="answer"
                ref={answerRef}
                style={{
                    display: "block",
                    opacity: opened ? 1 : 0,
                    transition: "opacity 0.3s",
                    pointerEvents: opened ? "auto" : "none"
                }}
            >
                {answer}
            </div>
        </div>
    );
};

export default FaqItem;
