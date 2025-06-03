using System.Collections.Concurrent;

namespace Api.Services;

public class InitializationCoordinator
{
    private readonly ConcurrentDictionary<string, TaskCompletionSource> _signals = new();

    public Task WaitFor(string key)
    {
        var tcs = _signals.GetOrAdd(key, _ => new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously));
        return tcs.Task;
    }

    public void Signal(string key)
    {
        var tcs = _signals.GetOrAdd(key, _ => new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously));
        tcs.TrySetResult();
    }
}