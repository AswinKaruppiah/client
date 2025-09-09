"use client";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Sparkles, Home, Type, Download, CheckCircle } from "lucide-react";
import DesignList from "./templates";
import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { generateRealEstateFlyerContent } from "@/services/ai-service";
import { generateFile } from "@/services/design-service";

function TemplateModal({
  isOpen,
  onClose,
  userDesigns,
  setShowDesignsModal,
  userDesignsLoading,
}) {
  const [description, setDescription] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(null);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleCreateDesign = () => {
    // This would redirect to the editor with the generated content
    alert("This would redirect to the editor to create the flyer design!");
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setGeneratedContent(null); // Reset generated content when template changes
  };

  const handleCreateNewDesign = async () => {
    try {
      setLoading(true);

      const initialDesignData = {
        id: active,
        prompt: description,
      };

      const newDesign = await generateFile(initialDesignData);
      setLoading(false);
      setActive(null);
      setDescription("");
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  function onClickFun(data) {
    setActive((pre) => (pre === data ? "" : data));
  }

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
                  <div className="p-4">
                    <DesignList
                      edit={false}
                      setShowDesignsModal={setShowDesignsModal}
                      isModalView={true}
                      listOfDesigns={userDesigns}
                      isLoading={userDesignsLoading}
                      onTemplateSelect={handleTemplateSelect}
                      selectedTemplate={selectedTemplate}
                      onClickFun={onClickFun}
                      active={active}
                    />
                  </div>
                </div>
              </div>

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
                        disabled={loading}
                      />
                    </div>

                    <Button
                      onClick={handleCreateNewDesign}
                      disabled={!description.trim() || loading}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3"
                      size="lg"
                    >
                      {loading ? (
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
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TemplateModal;
