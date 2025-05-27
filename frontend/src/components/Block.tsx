import type { ReactNode } from "react";
import "./Block.css";

interface BlockProps {
    image?: string;
    children?: ReactNode;
    paddingbottom?: string;
    zIndex?: number;
}

const Block: React.FC<BlockProps> = ({ children, image, paddingbottom, zIndex }) => {
    const style: React.CSSProperties = {};

    if (typeof paddingbottom !== "undefined") {
        style.paddingBottom = paddingbottom;
    }
    if (typeof zIndex !== "undefined") {
        style.zIndex = zIndex;
    }

    return (
        <div
            className={`block${image ? " image" : ""}`}
            style={Object.keys(style).length ? style : undefined}
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