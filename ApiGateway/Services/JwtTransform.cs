using Yarp.ReverseProxy.Forwarder;
using System.Net;

public class JwtValidationTransform : HttpTransformer
{
    private readonly HttpClient _httpClient;

    public JwtValidationTransform(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    public override async ValueTask TransformRequestAsync(HttpContext httpContext, HttpRequestMessage proxyRequest, string destinationPrefix)
    {
        if (!httpContext.Request.Path.StartsWithSegments("/auth"))
        {
            var token = httpContext.Request.Headers["Authorization"].FirstOrDefault();

            if (string.IsNullOrEmpty(token))
            {
                httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }
            var validationRequest = new HttpRequestMessage(HttpMethod.Get, "http://auth-service/api/auth/validate");
            validationRequest.Headers.Add("Authorization", token);

            var validationResponse = await _httpClient.SendAsync(validationRequest);

            if (!validationResponse.IsSuccessStatusCode)
            {
                httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }
        }

        await base.TransformRequestAsync(httpContext, proxyRequest, destinationPrefix);
    }
}