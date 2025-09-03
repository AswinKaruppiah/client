"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateRealEstateFlyerContent } from "@/services/ai-service";
import { Home, Sparkles, Download, Edit3 } from "lucide-react";

export default function FlyerDemoPage() {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleGenerateFlyer = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    setGeneratedContent(null);

    try {
      const response = await generateRealEstateFlyerContent(description);

      if (response.success) {
        setGeneratedContent(response.data);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Failed to generate flyer content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDesign = () => {
    // This would redirect to the editor with the generated content
    // For demo purposes, we'll just show a message
    alert("This would redirect to the editor to create the flyer design!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Home className="h-12 w-12 text-orange-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">
              AI Real Estate Flyer Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate professional real estate flyers instantly with AI. Simply
            describe your property and let our AI create a beautiful, structured
            flyer for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
              Generate Your Flyer
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your property:
                </label>
                <Textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="e.g., Beautiful large 3 bedroom, and swimming pool, 3400 sq ft, home for sale at Albany 12034"
                  className="resize-none min-h-[120px] text-base"
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={handleGenerateFlyer}
                disabled={!description.trim() || isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Flyer...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Flyer
                  </>
                )}
              </Button>

              {generatedContent && (
                <div className="pt-4 border-t">
                  <Button
                    onClick={handleCreateDesign}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Edit3 className="mr-2 h-5 w-5" />
                    Create Design in Editor
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Flyer Preview
            </h2>

            {!showPreview ? (
              <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <Home className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">Your flyer preview will appear here</p>
                  <p className="text-sm">
                    Enter a property description and click generate
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Generated Content Display */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">
                    {generatedContent.title}
                  </h3>
                  <p className="text-lg text-blue-700 mb-4 text-center">
                    {generatedContent.subtitle}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {generatedContent.features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 text-center"
                      >
                        <span className="font-semibold text-gray-800">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-4">
                    {generatedContent.details.map((detail, index) => (
                      <p key={index} className="text-gray-700 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-xl font-bold text-red-600">
                      {generatedContent.callToAction}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleCreateDesign}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit in Designer
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Describe Your Property
              </h3>
              <p className="text-gray-600">
                Simply enter a description of your property with key details
                like bedrooms, square footage, and features.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                AI Generates Content
              </h3>
              <p className="text-gray-600">
                Our AI analyzes your description and creates structured,
                professional flyer content automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Customize & Export
              </h3>
              <p className="text-gray-600">
                Edit text content and size, then export your professional real
                estate flyer ready for marketing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
