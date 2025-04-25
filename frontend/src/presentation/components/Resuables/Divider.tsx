import React from "react";

type DividerProps = Omit<React.HtmlHTMLAttributes<HTMLHRElement>, "className"> & {
    isVertical?: boolean;
};

export default function Divider(props: DividerProps) {
    const { isVertical = false } = props;

    if (isVertical) {
        return <hr className="w-0 h-full border-r border-gray-300 shadow-lg" {...props}></hr>;
    }

    return <hr className="h-0 w-full border-t border-gray-300 shadow-lg" {...props}></hr>;
}
