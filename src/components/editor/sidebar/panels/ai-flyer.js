"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addTextToCanvas } from "@/fabric/fabric-utils";
import { generateRealEstateFlyerContent } from "@/services/ai-service";
import { useEditorStore } from "@/store";
import { Loader, Home, Sparkles, Type } from "lucide-react";
import { useState } from "react";

function AiFlyerPanel() {
  const { canvas } = useEditorStore();
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleGenerateFlyer = async () => {
    if (!description.trim() || !canvas) return;

    setIsLoading(true);
    setGeneratedContent(null);

    try {
      const response = await generateRealEstateFlyerContent(description);

      if (response.success) {
        setGeneratedContent(response.data);
        generateFlyerOnCanvas(response.data);
      }
    } catch (error) {
      console.error("Failed to generate flyer content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFlyerOnCanvas = async (content) => {
    if (!canvas) return;

    try {
      // Clear existing content
      canvas.clear();

      // Set background color
      canvas.backgroundColor = "#f8f9fa";
      canvas.renderAll();

      // Add title
      const title = await addTextToCanvas(canvas, content.title, {
        fontSize: 48,
        fontWeight: "bold",
        fontFamily: "Arial",
        fill: "#1a365d",
        left: 50,
        top: 50,
        textAlign: "center",
        width: 700,
      });

      // Add subtitle
      const subtitle = await addTextToCanvas(canvas, content.subtitle, {
        fontSize: 24,
        fontWeight: "normal",
        fontFamily: "Arial",
        fill: "#4a5568",
        left: 50,
        top: 120,
        textAlign: "center",
        width: 700,
      });

      // Add features
      let featureY = 200;
      content.features.forEach(async (feature, index) => {
        await addTextToCanvas(canvas, feature, {
          fontSize: 20,
          fontWeight: "bold",
          fontFamily: "Arial",
          fill: "#2d3748",
          left: 50,
          top: featureY + index * 40,
          textAlign: "left",
          width: 700,
        });
      });

      // Add details
      let detailY = 200 + content.features.length * 40 + 40;
      content.details.forEach(async (detail, index) => {
        await addTextToCanvas(canvas, detail, {
          fontSize: 16,
          fontWeight: "normal",
          fontFamily: "Arial",
          fill: "#4a5568",
          left: 70,
          top: detailY + index * 25,
          textAlign: "left",
          width: 650,
        });
      });

      // Add call to action
      const callToAction = await addTextToCanvas(canvas, content.callToAction, {
        fontSize: 28,
        fontWeight: "bold",
        fontFamily: "Arial",
        fill: "#e53e3e",
        left: 50,
        top: 500,
        textAlign: "center",
        width: 700,
      });

      canvas.renderAll();
    } catch (error) {
      console.error("Failed to generate flyer on canvas:", error);
    }
  };

  const handleAddCustomText = () => {
    if (!canvas) return;
    addTextToCanvas(canvas, "Enter text here", {
      fontSize: 24,
      left: 100,
      top: 100,
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Home className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">AI Flyer Generator</h3>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Describe your property:
          </label>
          <Textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="e.g., Beautiful large 3 bedroom, and swimming pool, 3400 sq ft, home for sale at Albany 12034"
            className="resize-none min-h-[120px]"
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleGenerateFlyer}
          disabled={!description.trim() || isLoading}
          className="w-full bg-orange-600 hover:bg-orange-700"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Generating Flyer...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Flyer
            </>
          )}
        </Button>

        <div className="pt-4 border-t">
          <Button
            onClick={handleAddCustomText}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Type className="mr-2 h-4 w-4" />
            Add Custom Text
          </Button>
        </div>

        {isLoading && (
          <div className="border rounded-md bg-gray-50 p-6 flex flex-col items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-orange-500 mb-3" />
            <p className="text-sm text-center text-gray-600">
              Creating your real estate flyer...
            </p>
          </div>
        )}

        {generatedContent && !isLoading && (
          <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-medium text-green-800">
              Flyer Generated Successfully!
            </h4>
            <div className="text-sm text-green-700">
              <p>
                <strong>Title:</strong> {generatedContent.title}
              </p>
              <p>
                <strong>Subtitle:</strong> {generatedContent.subtitle}
              </p>
              <p>
                <strong>Features:</strong>{" "}
                {generatedContent.features.join(", ")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AiFlyerPanel;
