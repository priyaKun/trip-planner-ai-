package com.travel.travelplanner;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    private static final String API_URL = "https://openrouter.ai/api/v1/chat/completions";

    @Value("${openrouter.api.key}")
    private String apiKey;

    public String getItinerary(TravelRequest request) throws IOException {
        String destination = request.getDestination();
        int days = request.getDays();
        String theme = request.getTheme();
        String pace = request.getPace();

        String prompt = "Plan a " + days + "-day trip to " + destination + ". " +
                "The theme is '" + theme + "' and the pace is '" + pace + "'. " +
                "Return the response ONLY as plain text (no JSON, no markdown, no code blocks). " +
                "Do NOT use any backticks, symbols, or formatting. " +
                "Label each day like 'Day 1:', then list activities for morning, lunch, afternoon, and evening. " +
                "Separate each part clearly in plain text. " +
                "At the end, include a plain text list of travel tips. Do not include any markdown or explanations.";



        // Prepare the OpenAI message payload
        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "qwen/qwen3-14b:free");
        body.put("messages", List.of(message));
        body.put("temperature", 0.7);

        // Set up HTTP client and request
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(API_URL);
        httpPost.setHeader("Authorization", "Bearer " + apiKey);
        httpPost.setHeader("HTTP-Referer", "https://yourdomain.com"); // Replace with your real domain if needed
        httpPost.setHeader("X-Title", "Travel Planner");
        httpPost.setHeader("Content-Type", "application/json");

        // Convert request body to JSON and attach it
        ObjectMapper mapper = new ObjectMapper();
        String jsonBody = mapper.writeValueAsString(body);
        httpPost.setEntity(new StringEntity(jsonBody));

        // Send request and return response
        String response = client.execute(httpPost, httpResponse ->
                new String(httpResponse.getEntity().getContent().readAllBytes()));
        System.out.println("🔍 OpenRouter Raw Response: " + response);

        client.close();

        Map<String, Object> responseMap = mapper.readValue(response, Map.class);
        List<Map<String, Object>> choices = (List<Map<String, Object>>) responseMap.get("choices");

        if (choices != null && !choices.isEmpty()) {
            Map<String, Object> messageMap = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) messageMap.get("content");

            // 🔧 Remove markdown/code block formatting
            content = content.replaceAll("(?s)```.*?```", ""); // Remove code blocks
            content = content.replaceAll("```", "");           // Remove stray backticks

            return content.trim(); // ✅ Clean and ready for frontend
        }

        return destination;
    }
}
