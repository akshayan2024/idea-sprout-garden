import { create } from 'zustand';
import { contentService } from '../services/contentService';

export const useContentStore = create((set) => ({
  metaCreator: null,
  metaContent: null,
  generatedIdeas: [],
  processContentAspiration: async (data) => {
    try {
      const result = await contentService.processContentAspiration(data);
      set({ 
        metaCreator: result.meta_creator,
        metaContent: result.meta_content
      });
    } catch (error) {
      console.error('Content aspiration processing failed:', error);
    }
  },
  generateIdeas: async (data) => {
    try {
      const result = await contentService.generateIdeas(data);
      set({ generatedIdeas: result.generated_idea });
    } catch (error) {
      console.error('Idea generation failed:', error);
    }
  }
}));