import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageSquare, Send, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import type { CalculationResults } from "../../../shared/calculationEngine";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIExplainerProps {
  results?: any;
  calculationResults?: any;
  platformName?: string;
  platformNumber?: number;
  title?: string;
  description?: string;
  initialContext?: string;
}

export function AIExplainer({
  results,
  calculationResults,
  platformName,
  platformNumber,
  title = "AI Financial Explainer",
  description = "Ask questions about the calculations. Get clear, direct answers.",
  initialContext,
}: AIExplainerProps) {
  const effectiveResults = results || calculationResults;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const chatMutation = trpc.ai.chat.useMutation();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await chatMutation.mutateAsync({
        question: input,
        results,
        conversationHistory: messages,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI explainer error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleQuickExplain = async () => {
    if (platformName && platformNumber !== undefined) {
      setIsOpen(true);
      const explainMutation = trpc.ai.explainPlatform.useMutation();
      
      try {
        const response = await explainMutation.mutateAsync({
          platformName,
          platformNumber,
          results,
        });

        const message: Message = {
          role: "assistant",
          content: response.explanation,
        };
        setMessages([message]);
      } catch (error) {
        console.error("Platform explanation error:", error);
      }
    } else {
      setIsOpen(true);
      const explainMutation = trpc.ai.explainConsolidated.useMutation();
      
      try {
        const response = await explainMutation.mutateAsync({
          results,
        });

        const message: Message = {
          role: "assistant",
          content: response.explanation,
        };
        setMessages([message]);
      } catch (error) {
        console.error("Consolidated explanation error:", error);
      }
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={handleQuickExplain}
        variant="outline"
        className="gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Explain This
      </Button>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ask a question about the calculations.</p>
                <p className="text-sm mt-2">
                  Examples: "How is Platform 0 calculated?" or "Why is the total $111.9M?"
                </p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Streamdown>{message.content}</Streamdown>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask a question..."
            disabled={chatMutation.isPending}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || chatMutation.isPending}
            size="icon"
          >
            {chatMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMessages([])}
            disabled={messages.length === 0}
          >
            Clear Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
