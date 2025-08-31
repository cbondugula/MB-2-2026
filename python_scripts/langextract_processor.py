#!/usr/bin/env python3
"""
LangExtract Integration Service for MedBuilder
Provides healthcare-specific text extraction using advanced NLP
"""

import json
import sys
import time
import os
import re
from typing import Dict, List, Any, Optional
import argparse

# Mock LangExtract for demonstration - replace with real implementation
LANGEXTRACT_AVAILABLE = False
try:
    import langextract as lx
    from langextract.data import ExampleData, Extraction
    LANGEXTRACT_AVAILABLE = True
except ImportError:
    # Use mock implementation
    pass

class HealthcareLangExtract:
    """Healthcare-specific LangExtract wrapper for medical text processing"""
    
    def __init__(self):
        self.healthcare_templates = {
            "medication": {
                "instructions": """
                Extract medication information from clinical text:
                - Medication name
                - Dosage amount and frequency
                - Route of administration
                - Duration or quantity
                """,
                "examples": [
                    {
                        "text": "Patient prescribed metformin 500mg twice daily for diabetes management.",
                        "extractions": [{
                            "extraction_class": "medication",
                            "extraction_text": "metformin 500mg twice daily",
                            "attributes": {
                                "medication_name": "metformin",
                                "dosage": "500mg",
                                "frequency": "twice daily",
                                "indication": "diabetes management"
                            }
                        }]
                    }
                ]
            },
            "diagnosis": {
                "instructions": """
                Extract diagnostic information from clinical text:
                - Primary diagnosis
                - Secondary diagnoses
                - ICD-10 codes if mentioned
                - Severity or stage
                """,
                "examples": [
                    {
                        "text": "Patient diagnosed with Type 2 Diabetes Mellitus (E11.9) and hypertension.",
                        "extractions": [{
                            "extraction_class": "diagnosis",
                            "extraction_text": "Type 2 Diabetes Mellitus (E11.9)",
                            "attributes": {
                                "diagnosis_name": "Type 2 Diabetes Mellitus",
                                "icd10_code": "E11.9",
                                "type": "primary"
                            }
                        }]
                    }
                ]
            },
            "lab_result": {
                "instructions": """
                Extract laboratory results from clinical text:
                - Test name
                - Result value
                - Reference range
                - Units
                - Abnormal flags
                """,
                "examples": [
                    {
                        "text": "HbA1c: 8.2% (elevated, normal <7.0%)",
                        "extractions": [{
                            "extraction_class": "lab_result",
                            "extraction_text": "HbA1c: 8.2% (elevated, normal <7.0%)",
                            "attributes": {
                                "test_name": "HbA1c",
                                "result_value": "8.2",
                                "units": "%",
                                "reference_range": "<7.0%",
                                "abnormal_flag": "elevated"
                            }
                        }]
                    }
                ]
            },
            "symptom": {
                "instructions": """
                Extract symptom information from clinical text:
                - Symptom description
                - Duration
                - Severity
                - Associated factors
                """,
                "examples": [
                    {
                        "text": "Patient reports severe chest pain for 2 hours, radiating to left arm.",
                        "extractions": [{
                            "extraction_class": "symptom",
                            "extraction_text": "severe chest pain for 2 hours, radiating to left arm",
                            "attributes": {
                                "symptom": "chest pain",
                                "severity": "severe",
                                "duration": "2 hours",
                                "radiation": "left arm"
                            }
                        }]
                    }
                ]
            }
        }

    def extract_healthcare_data(self, text: str, extraction_type: str, 
                              custom_instructions: Optional[str] = None,
                              custom_examples: Optional[List] = None) -> Dict[str, Any]:
        """Extract structured healthcare data from text"""
        start_time = time.time()
        
        try:
            if LANGEXTRACT_AVAILABLE:
                # Use real LangExtract when available
                return self._extract_with_langextract(text, extraction_type, custom_instructions, custom_examples)
            else:
                # Use mock extraction for demonstration
                return self._extract_with_mock(text, extraction_type, custom_instructions)
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "processing_time": time.time() - start_time
            }
    
    def _extract_with_langextract(self, text: str, extraction_type: str, 
                                custom_instructions: Optional[str] = None,
                                custom_examples: Optional[List] = None) -> Dict[str, Any]:
        """Real LangExtract implementation"""
        # Implementation for real LangExtract
        # This will be populated when the library is properly integrated
        pass
    
    def _extract_with_mock(self, text: str, extraction_type: str, 
                         custom_instructions: Optional[str] = None) -> Dict[str, Any]:
        """Mock extraction for demonstration purposes"""
        start_time = time.time()
        
        # Simple regex-based extraction for demonstration
        extractions = []
        
        if extraction_type == "medication":
            # Extract medication patterns
            med_patterns = [
                r'(\w+)\s+(\d+\s*mg)\s+([\w\s]+daily|[\w\s]+times?\s+daily)',
                r'(\w+)\s+(\d+\s*mg)',
                r'(metformin|lisinopril|atorvastatin|aspirin|insulin)'
            ]
            
            for pattern in med_patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    extractions.append({
                        "extraction_class": "medication",
                        "extraction_text": match.group(0),
                        "attributes": {
                            "medication_name": match.group(1) if len(match.groups()) > 0 else match.group(0),
                            "dosage": match.group(2) if len(match.groups()) > 1 else "not specified",
                            "frequency": match.group(3) if len(match.groups()) > 2 else "not specified"
                        }
                    })
        
        elif extraction_type == "diagnosis":
            # Extract diagnosis patterns
            diag_patterns = [
                r'(Type\s+2\s+Diabetes\s+Mellitus)',
                r'(hypertension)',
                r'(myocardial\s+infarction)',
                r'(diabetes)',
                r'diagnosed\s+with\s+([^.]+)'
            ]
            
            for pattern in diag_patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    extractions.append({
                        "extraction_class": "diagnosis",
                        "extraction_text": match.group(0),
                        "attributes": {
                            "diagnosis_name": match.group(1) if len(match.groups()) > 0 else match.group(0),
                            "type": "primary"
                        }
                    })
        
        elif extraction_type == "lab_result":
            # Extract lab result patterns
            lab_patterns = [
                r'(\w+):\s*(\d+\.?\d*)\s*([^,\n]+)',
                r'(HbA1c|Glucose|Creatinine|WBC|Hemoglobin):\s*(\d+\.?\d*)\s*([^,\n]+)'
            ]
            
            for pattern in lab_patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    extractions.append({
                        "extraction_class": "lab_result",
                        "extraction_text": match.group(0),
                        "attributes": {
                            "test_name": match.group(1),
                            "result_value": match.group(2),
                            "reference_info": match.group(3) if len(match.groups()) > 2 else ""
                        }
                    })
        
        elif extraction_type == "symptom":
            # Extract symptom patterns
            symptom_patterns = [
                r'(chest\s+pain)',
                r'(shortness\s+of\s+breath)',
                r'(nausea)',
                r'(diaphoresis)',
                r'pain.*?(\d+/10)'
            ]
            
            for pattern in symptom_patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    extractions.append({
                        "extraction_class": "symptom",
                        "extraction_text": match.group(0),
                        "attributes": {
                            "symptom": match.group(0),
                            "severity": match.group(1) if len(match.groups()) > 0 and '/10' in str(match.group(1)) else "not specified"
                        }
                    })
        
        # Generate simple HTML visualization
        visualization_html = self._generate_visualization_html(text, extractions)
        
        processing_time = time.time() - start_time
        
        return {
            "success": True,
            "extractions": extractions,
            "visualization_html": visualization_html,
            "processing_time": processing_time,
            "model_used": "mock-nlp-extractor",
            "confidence": self._calculate_confidence(extractions),
            "source_grounding": self._extract_source_grounding(extractions)
        }
    
    def _generate_visualization_html(self, text: str, extractions: List[Dict]) -> str:
        """Generate HTML visualization of extractions"""
        if not extractions:
            return f'<div class="p-4 border rounded"><p>{text}</p></div>'
        
        # Create highlighted text
        highlighted_text = text
        colors = {
            "medication": "#3B82F6",
            "diagnosis": "#EF4444", 
            "lab_result": "#10B981",
            "symptom": "#F59E0B"
        }
        
        for i, extraction in enumerate(extractions):
            color = colors.get(extraction["extraction_class"], "#6B7280")
            highlighted_text = highlighted_text.replace(
                extraction["extraction_text"],
                f'<span style="background-color: {color}20; border: 1px solid {color}; padding: 2px 4px; border-radius: 3px; color: {color}; font-weight: 500;">{extraction["extraction_text"]}</span>'
            )
        
        legend_html = '<div class="mb-4 flex flex-wrap gap-2">'
        for extraction_class, color in colors.items():
            legend_html += f'<span style="background-color: {color}20; border: 1px solid {color}; padding: 2px 8px; border-radius: 3px; color: {color}; font-size: 12px;">{extraction_class.replace("_", " ").title()}</span>'
        legend_html += '</div>'
        
        return f'''
        <div class="p-4 border rounded">
            {legend_html}
            <div class="leading-relaxed">{highlighted_text}</div>
        </div>
        '''

    def _calculate_confidence(self, result: Any) -> int:
        """Calculate overall confidence score (0-100)"""
        # Simple confidence calculation based on extraction quality
        if not result:
            return 0
        
        # For now, return a reasonable confidence score
        # In practice, this would analyze extraction quality, grounding, etc.
        return 85

    def _extract_source_grounding(self, result: Any) -> List[Dict]:
        """Extract source grounding information"""
        # LangExtract provides character offset grounding
        # This would extract that information
        grounding = []
        
        # Placeholder implementation
        if result:
            grounding = [
                {
                    "start_offset": 0,
                    "end_offset": 10,
                    "extraction_id": "sample",
                    "confidence": 0.9
                }
            ]
        
        return grounding

    def get_available_templates(self) -> Dict[str, Any]:
        """Get all available healthcare extraction templates"""
        return {
            name: {
                "name": name,
                "description": template["instructions"],
                "example_count": len(template["examples"])
            } for name, template in self.healthcare_templates.items()
        }

def main():
    parser = argparse.ArgumentParser(description='LangExtract Healthcare Processor')
    parser.add_argument('--text', help='Text to process')
    parser.add_argument('--type', help='Extraction type')
    parser.add_argument('--instructions', help='Custom instructions')
    parser.add_argument('--examples', help='Custom examples JSON')
    parser.add_argument('--action', default='extract', help='Action to perform')
    
    args = parser.parse_args()
    
    # Validate required arguments based on action
    if args.action == 'extract' and (not args.text or not args.type):
        parser.error("--text and --type are required for extract action")
    
    processor = HealthcareLangExtract()
    
    if args.action == 'extract':
        custom_examples = None
        if args.examples:
            try:
                custom_examples = json.loads(args.examples)
            except json.JSONDecodeError:
                print(json.dumps({"error": "Invalid JSON in examples parameter"}))
                sys.exit(1)
        
        result = processor.extract_healthcare_data(
            text=args.text,
            extraction_type=args.type,
            custom_instructions=args.instructions,
            custom_examples=custom_examples
        )
        
        print(json.dumps(result, indent=2))
    
    elif args.action == 'templates':
        templates = processor.get_available_templates()
        print(json.dumps(templates, indent=2))
    
    else:
        print(json.dumps({"error": f"Unknown action: {args.action}"}))
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
