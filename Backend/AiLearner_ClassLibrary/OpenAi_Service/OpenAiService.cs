using Microsoft.Extensions.Configuration;
using OpenAI_API;
using OpenAI_API.Models;
using System.Net.Http;
using System.Text;


namespace AiLearner_ClassLibrary.OpenAi_Service
{
    public class OpenAIService
    {
        private readonly HttpClient _httpClient;
        private readonly string? _apiKey;

        string lmStudioEndpoint = "http://localhost:1234/v1/chat/completions"; // Replace with the actual server address and port
        string modelId = "llama2-7b";

        public OpenAIService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _apiKey = configuration["OpenAI:ApiKey"];
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
        }

        public async Task<string> CallChatGPTAsync(string message, int numberOfQuestion)
        {
            OpenAIAPI openAIAPI = new(_apiKey);
            var chat = openAIAPI.Chat.CreateConversation();

            chat.Model = new Model("gpt-3.5-turbo-0125");

            chat.AppendSystemMessage("you generate multiple answer questions base on text. 4 answers per question, make some of the 2 answers.");
            chat.AppendSystemMessage("Youre only response will be a JSON object with six variables:topic string, summary 1-3 sentences describing the text, a a questions object that contains: question string, options object with key value pair, answer a letter char");

            chat.AppendUserInput(message + $"\n generate {numberOfQuestion} question base on this study material");

            return await chat.GetResponseFromChatbotAsync();
        }

        public async Task<string> GetLMStudioResponse(string message, int numberOfQuestions)
        {
            var payload = new
            {
                model = modelId,
                messages = new[]
                {
            new { role = "system", content = "you generate multiple answer questions base on text. 4 answers per question, make some of the 2 answers." },
            new { role = "system", content = "Youre only response will be a JSON object with six variables:topic string, summary 1-3 sentences describing the text, a a questions object that contains: question string, options object with key value pair, answer a letter char" },
            new { role = "user", content = message + $"\n generate {numberOfQuestions} question base on this study material" }
        }
            };

            using (var httpClient = new HttpClient())
            {
                var jsonPayload = Newtonsoft.Json.JsonConvert.SerializeObject(payload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync(lmStudioEndpoint, content);
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    // Handle error, e.g., throw an exception
                    throw new Exception("LM Studio request failed: " + response.StatusCode);
                }
            }
        }
    }
}
