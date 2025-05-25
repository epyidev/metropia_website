import type { ReactNode } from "react";
import "./Block.css";

interface BlockProps {
    children?: ReactNode;
}

const Block: React.FC<BlockProps> = ({ children }) => {
    return (
        <div className="block">
            <div className="readzone">
                {children}
            </div>
        </div>
    );
};

export default Block;