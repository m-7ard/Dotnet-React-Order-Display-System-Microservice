import { render, screen, fireEvent } from '@testing-library/react';
import GlobalDialog from '../presentation/components/Dialog/GlobalDialog';
import GlobalDialogManager from '../presentation/components/Dialog/GlobalDialog.Manager';
import '@testing-library/jest-dom';

const MockPanel = jest.fn(({ message }) => <div>Mock Panel: {message}</div>);

const MockTrigger = ({ onToggle }: { onToggle: () => void }) => (
    <button onClick={onToggle}>Open Dialog</button>
);

describe('GlobalDialogManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GlobalDialogManager open; On trigger click; Success;', () => {
        render(
            <GlobalDialogManager href='/'>
                <GlobalDialog
                    Trigger={MockTrigger}
                    Panel={MockPanel}
                    panelProps={{ message: 'Initial' }}
                    zIndex={1000}
                />
            </GlobalDialogManager>
        );

        fireEvent.click(screen.getByText('Open Dialog'));
        expect(MockPanel).toHaveBeenCalledTimes(1);
    });

    test('GlobalDialogManager closes; On backdrop click; Success;', () => {
        render(
            <GlobalDialogManager href='/'>
                <GlobalDialog
                    Trigger={MockTrigger}
                    Panel={MockPanel}
                    panelProps={{ message: 'Initial' }}
                    zIndex={1000}
                />
            </GlobalDialogManager>
        );

        fireEvent.click(screen.getByText('Open Dialog'));
        const backdrop = screen.getByRole("backdrop");
        fireEvent.mouseDown(backdrop);
        expect(screen.queryByText('Mock Panel: Initial')).not.toBeInTheDocument();
    });

    test('GlobalDialogManager updates props; New props; Success;', () => {
        const TestComponent = ({ message }: { message: string }) => (
            <GlobalDialogManager href='/'>
                <GlobalDialog
                    Trigger={MockTrigger}
                    Panel={MockPanel}
                    panelProps={{ message }}
                    zIndex={1000}
                />
            </GlobalDialogManager>
        );

        const { rerender } = render(<TestComponent message="Hello" />);
        fireEvent.click(screen.getByText('Open Dialog'));
        expect(MockPanel).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Hello' }),
            expect.anything()
        );

        rerender(<TestComponent message="Updated" />);
        expect(MockPanel).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Updated' }),
            expect.anything()
        );

        expect(MockPanel).toHaveBeenCalledTimes(3);
        expect(screen.getByText('Mock Panel: Updated')).toBeInTheDocument();
    });

    
    test('GlobalDialogManager updates props; Same props; Failure;', () => {
        const TestComponent = ({ message }: { message: string }) => (
            <GlobalDialogManager href='/'>
                <GlobalDialog
                    Trigger={MockTrigger}
                    Panel={MockPanel}
                    panelProps={{ message }}
                    zIndex={1000}
                />
            </GlobalDialogManager>
        );

        const { rerender } = render(<TestComponent message="Message1" />);
        fireEvent.click(screen.getByText('Open Dialog'));
        expect(MockPanel).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Message1' }),
            expect.anything()
        );

        rerender(<TestComponent message="Message1" />);
        expect(MockPanel).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Message1' }),
            expect.anything()
        );

        expect(MockPanel).toHaveBeenCalledTimes(2);
    });

    test('GlobalDialogManager closes all dialogs; Different location; Success;', async () => {
        const TestComponent = ({ location }: { location: string }) => (
            <GlobalDialogManager href={location}>
                <GlobalDialog
                    Trigger={MockTrigger}
                    Panel={MockPanel}
                    panelProps={{ message: "Panel UID" }}
                    zIndex={1000}
                />
            </GlobalDialogManager>
        );

        const { rerender } = render(<TestComponent location="/" />);
        fireEvent.click(screen.getByText('Open Dialog'));
        rerender(<TestComponent location='/new-locatiom' />);
        
        expect(screen.queryByText('Mock Panel: Panel UID')).not.toBeInTheDocument();
    });

    test('GlobalDialogManager closes all dialogs; Same location; Failure;', () => {
        const TestComponent = ({ location }: { location: string }) => (
            <GlobalDialogManager href={location}>
                <GlobalDialog
                    Trigger={MockTrigger}
                    Panel={MockPanel}
                    panelProps={{ message: "Panel UID" }}
                    zIndex={1000}
                />
            </GlobalDialogManager>
        );

        const { rerender } = render(<TestComponent location="/" />);
        fireEvent.click(screen.getByText('Open Dialog'));
        rerender(<TestComponent location='/' />);
        
        expect(screen.queryByText('Mock Panel: Panel UID')).toBeInTheDocument();
    });
});