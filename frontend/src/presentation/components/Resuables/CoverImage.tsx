export default function CoverImage(props: { src?: string; className: string }) {
    return <div className={`relative ${props.className}`}>{props.src != null && <img className="absolute w-full h-full object-cover sm:object-cover" src={props.src} alt={props.src}></img>}</div>;
}
