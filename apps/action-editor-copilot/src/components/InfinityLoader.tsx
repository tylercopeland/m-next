import React from "react";
import "./InfinityLoader.scss"; // CSS modules not used
const InfinityLoaderSVGString: string = require("./InfinityLoader.svg.txt");

const InfinityLoader: React.FC = () => {
    const encodedSvg = `data:image/svg+xml;utf8,${encodeURIComponent(InfinityLoaderSVGString)}`;

    return (
        <div className="infinityLoaderWrapper">
            <div className="ringContainer">
                <div
                    className="ring"
                    style={
                        { "--mask": `url("${encodedSvg}")` } as React.CSSProperties
                    }
                />
            </div>
            <div className="ringContainer left">
                <div
                    className="ring left"
                    style={
                        { "--mask": `url("${encodedSvg}")` } as React.CSSProperties
                    }
                />
            </div>
        </div>
    );
};

export default InfinityLoader;
