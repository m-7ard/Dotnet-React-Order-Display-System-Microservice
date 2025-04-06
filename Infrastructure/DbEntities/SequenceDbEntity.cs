namespace Infrastructure.DbEntities;

public class SequenceDbEntity
{
    public SequenceDbEntity(string id, int currentValue)
    {
        Id = id;
        CurrentValue = currentValue;
    }

    public string Id { get; set; }
    public int CurrentValue { get; set; }
}