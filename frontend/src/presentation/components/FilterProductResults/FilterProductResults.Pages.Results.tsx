import { PropsWithChildren } from "react";

export default function ResultsPage(props: PropsWithChildren) {
    const { children } = props;

    return (
        <section className="flex flex-col sm:grid sm:grid-cols-2 gap-3 grow">
            {children}
        </section>
    );
}
