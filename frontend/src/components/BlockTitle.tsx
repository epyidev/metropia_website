import "./BlockTitle.css";

interface BlockTitleProps {
    title: string;
    subtitle?: string;
}

const BlockTitle: React.FC<BlockTitleProps> = ({ title, subtitle }) => {
    return (
        <div className="blocktitle">
            <p className="title">{title}</p>
            {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
    );
};

export default BlockTitle;
