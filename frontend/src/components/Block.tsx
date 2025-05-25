import type { ReactNode } from "react";
import "./Block.css";

interface BlockProps {
    image?: string;
    children?: ReactNode;
}

const Block: React.FC<BlockProps> = ({ children, image }) => {
    return (
        <div
            className={`block${image ? " image" : ""}`}
        >
        {image && (
            <img src={image} alt="Block visual" className="image" />
        )}
            <div className="readzone">
            {children}
            </div>
        </div>
    );
};

export default Block;