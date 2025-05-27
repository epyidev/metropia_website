import type { ReactNode } from "react";
import "./Block.css";

interface BlockProps {
    image?: string;
    children?: ReactNode;
    paddingbottom?: string;
}

const Block: React.FC<BlockProps> = ({ children, image, paddingbottom }) => {
    return (
        <div
            className={`block${image ? " image" : ""}`}
            style={typeof paddingbottom !== "undefined" ? { paddingBottom: paddingbottom } : undefined}
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