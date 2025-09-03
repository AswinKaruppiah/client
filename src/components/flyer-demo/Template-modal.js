"use client";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Sparkles, Home, Type, Download, CheckCircle } from "lucide-react";
import DesignList from "./templates";
import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { generateRealEstateFlyerContent } from "@/services/ai-service";

function TemplateModal({
  isOpen,
  onClose,
  userDesigns,
  setShowDesignsModal,
  userDesignsLoading,
}) {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleGenerateFlyer = async () => {
    if (!description.trim() || !selectedTemplate) return;

    setIsLoading(true);
    setGeneratedContent(null);

    try {
      const response = await generateRealEstateFlyerContent(description);

      if (response.success) {
        setGeneratedContent(response.data);
      }
    } catch (error) {
      console.error("Failed to generate flyer content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDesign = () => {
    // This would redirect to the editor with the generated content
    alert("This would redirect to the editor to create the flyer design!");
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setGeneratedContent(null); // Reset generated content when template changes
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={"sm:max-w-[1400px] h-[600px] p-0 gap-0 overflow-scroll"}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <DialogTitle
              className={"text-2xl font-bold mb-4 flex items-center"}
            >
              <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
              AI Flyer Generator & Templates
            </DialogTitle>
            <p className="text-gray-600">
              Select a template, describe your property, and generate your flyer
              content
            </p>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div>
              {/* Left Column - Templates */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Available Templates
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <DesignList
                      edit={false}
                      setShowDesignsModal={setShowDesignsModal}
                      isModalView={true}
                      listOfDesigns={userDesigns}
                      isLoading={userDesignsLoading}
                      onTemplateSelect={handleTemplateSelect}
                      selectedTemplate={selectedTemplate}
                    />
                  </div>
                </div>

                {/* Template Selection Status */}
                {selectedTemplate && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <p className="font-medium text-green-800">
                          Template Selected: {selectedTemplate.name}
                        </p>
                        <p className="text-sm text-green-700">
                          {selectedTemplate.width} × {selectedTemplate.height}{" "}
                          pixels
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Results Section - Below Templates */}
              {generatedContent && (
                <div className="mt-8 border-t pt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                    Generated Flyer Content
                  </h3>

                  <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Generated Content Display */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                        <h4 className="text-xl font-bold text-blue-900 mb-4 text-center">
                          {generatedContent.title}
                        </h4>
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

                      {/* Action Buttons and Info */}
                      <div className="space-y-6">
                        {/* Template Info */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-medium text-gray-800 mb-2">
                            Selected Template
                          </h4>
                          <p className="text-sm text-gray-600">
                            <strong>Name:</strong> {selectedTemplate?.name}
                            <br />
                            <strong>Dimensions:</strong>{" "}
                            {selectedTemplate?.width} ×{" "}
                            {selectedTemplate?.height} pixels
                            <br />
                            <strong>Type:</strong>{" "}
                            {selectedTemplate?.category || "Real Estate Flyer"}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <Button
                            onClick={handleCreateDesign}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            size="lg"
                          >
                            <Type className="mr-2 h-4 w-4" />
                            Create Design in Editor
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            size="lg"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Content
                          </Button>
                        </div>

                        {/* Success Message */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-green-800">
                                Flyer content generated successfully!
                              </p>
                              <p className="text-sm text-green-700">
                                You can now create a design or download the
                                content.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Column - AI Generator */}
              <div className="space-y-6">
                <h3 className="text-lg mt-5 font-semibold text-gray-800 mb-4">
                  Generate Your Flyer Content
                </h3>
                {/* Prompt Input Section */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Home className="h-5 w-5 text-orange-500 mr-2" />
                    Describe Your Property
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Description:
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
                          Generate Flyer Content
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Quick Tips */}
                {selectedTemplate && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">
                      💡 Quick Tips
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Include number of bedrooms and bathrooms</li>
                      <li>• Mention square footage and key features</li>
                      <li>• Specify location or zip code</li>
                      <li>• Add special amenities like pool, garage, etc.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TemplateModal;
