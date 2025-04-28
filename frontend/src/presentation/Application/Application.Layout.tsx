import { Outlet } from "@tanstack/react-router";
import ApplicationExceptionNotice from "./Application.ExceptionNotice";
import ApplicationHeader from "./Application.Header";
import ApplicationProvider from "./Application.Provider";

export default function ApplicationLayout() {
    // const [listeners, setListeners] = useState<Array<(event: IWebsocketEvent) => void>>([]);
// 
    // useEffect(() => {
    //     const socket = new WebSocket("ws://localhost:8080");
// 
    //     socket.addEventListener("open", () => {
    //         console.log("Connected to WebSocket server");
    //     });
// 
    //     socket.addEventListener("message", (event) => {
    //         try {
    //             const data = JSON.parse(event.data);
    //             console.log("received data: ", data);
    //         } catch (err) {
    //             console.error("Error parsing message:", err);
    //         }
    //     });
// 
    //     socket.addEventListener("error", (event) => {
    //         console.error("WebSocket error:", event);
    //     });
// 
    //     socket.addEventListener("close", () => {
    //         console.log("Disconnected from WebSocket server");
    //     });
// 
    //     return () => {
    //         socket.close();
    //     };
    // }, []);

    return (
        <ApplicationProvider>
            <main className="flex flex-col h-full w-full mx-auto overflow-hidden text-gray-800">
                <ApplicationExceptionNotice />
                <ApplicationHeader />
                <div className="flex flex-col grow overflow-auto">
                    <Outlet />
                </div>
            </main>
        </ApplicationProvider>
    );
}
