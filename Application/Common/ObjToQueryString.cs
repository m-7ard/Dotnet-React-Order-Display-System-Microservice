using Newtonsoft.Json;
using System.Web;

namespace Application.Common;
public class ObjToQueryString
{
    public static string Convert(object obj)
    {
        var step1 = JsonConvert.SerializeObject(obj);

        var step2 = JsonConvert.DeserializeObject<IDictionary<string, string>>(step1);

        var step3 = step2!.Select(x => HttpUtility.UrlEncode(x.Key) + "=" + HttpUtility.UrlEncode(x.Value));

        return string.Join("&", step3);
    }
}