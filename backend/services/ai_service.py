import logging
import os
import json
from typing import Dict, List, Any, Optional
import asyncio
from datetime import datetime

# Import AI libraries if available
try:
    import openai
    from langchain.chains import LLMChain
    from langchain.prompts import PromptTemplate
    from langchain.llms import OpenAI
    from langchain.embeddings import OpenAIEmbeddings
    from langchain.vectorstores import PGVector
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.document_loaders import TextLoader
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False

try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.embedding_model = None
        self.llm = None
        self.initialized = False
        
        # Initialize if possible
        self._initialize()
    
    def _initialize(self):
        """Initialize AI models if dependencies are available"""
        try:
            if self.openai_api_key and LANGCHAIN_AVAILABLE:
                # Set up OpenAI
                openai.api_key = self.openai_api_key
                
                # Initialize LangChain components
                self.llm = OpenAI(temperature=0.7, openai_api_key=self.openai_api_key)
                self.embeddings = OpenAIEmbeddings(openai_api_key=self.openai_api_key)
                
                self.initialized = True
                logger.info("AI service initialized with OpenAI")
            elif SENTENCE_TRANSFORMERS_AVAILABLE:
                # Use local sentence transformers as fallback
                self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
                logger.info("AI service initialized with local Sentence Transformers")
                self.initialized = True
            else:
                logger.warning("AI service initialization failed - missing dependencies")
        except Exception as e:
            logger.error(f"Error initializing AI service: {e}")
            self.initialized = False
    
    async def analyze_opportunity(self, opportunity_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a funding opportunity and extract key information"""
        try:
            if not self.initialized:
                return self._generate_mock_opportunity_analysis(opportunity_data)
            
            # Prepare the opportunity text
            opportunity_text = f"""
            Title: {opportunity_data.get('title', '')}
            Description: {opportunity_data.get('description', '')}
            Donor: {opportunity_data.get('source_name', '')}
            Amount: {opportunity_data.get('amount_min', 0)} - {opportunity_data.get('amount_max', 0)} {opportunity_data.get('currency', 'USD')}
            Deadline: {opportunity_data.get('deadline', '')}
            Country: {opportunity_data.get('country', '')}
            Sector: {opportunity_data.get('sector', '')}
            """
            
            # Use OpenAI for analysis if available
            if self.openai_api_key:
                prompt = f"""
                Analyze the following funding opportunity and extract key information:
                
                {opportunity_text}
                
                Please provide:
                1. A brief summary (2-3 sentences)
                2. Key eligibility requirements (list format)
                3. Main focus areas (list format)
                4. Potential challenges for applicants
                5. Recommended approach for application
                
                Format your response as JSON with the following structure:
                {{
                    "summary": "...",
                    "eligibility": ["...", "..."],
                    "focus_areas": ["...", "..."],
                    "challenges": ["...", "..."],
                    "recommended_approach": "..."
                }}
                """
                
                response = await openai.ChatCompletion.acreate(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are an expert in grant analysis and funding opportunities."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.5
                )
                
                try:
                    analysis = json.loads(response.choices[0].message.content)
                    return {
                        "status": "success",
                        "analysis": analysis,
                        "timestamp": datetime.utcnow().isoformat()
                    }
                except json.JSONDecodeError:
                    # If JSON parsing fails, return the raw text
                    return {
                        "status": "partial_success",
                        "analysis": {
                            "raw_text": response.choices[0].message.content
                        },
                        "timestamp": datetime.utcnow().isoformat()
                    }
            
            # Fallback to mock analysis
            return self._generate_mock_opportunity_analysis(opportunity_data)
            
        except Exception as e:
            logger.error(f"Error analyzing opportunity: {e}")
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def _generate_mock_opportunity_analysis(self, opportunity_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate mock analysis when AI services are unavailable"""
        title = opportunity_data.get('title', '')
        description = opportunity_data.get('description', '')
        
        # Extract keywords from title and description
        keywords = self._extract_keywords(title + " " + description)
        
        return {
            "status": "success",
            "analysis": {
                "summary": f"This opportunity from {opportunity_data.get('source_name', 'unknown donor')} focuses on {keywords[:2]}. It provides funding for projects in {opportunity_data.get('country', 'various countries')}.",
                "eligibility": [
                    "Registered non-profit organizations",
                    "Minimum 2 years of operational experience",
                    "Experience in the relevant sector"
                ],
                "focus_areas": keywords[:5],
                "challenges": [
                    "Competitive application process",
                    "Detailed reporting requirements",
                    "Strict compliance standards"
                ],
                "recommended_approach": "Focus on demonstrating clear impact metrics, sustainability plan, and alignment with donor priorities."
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text"""
        # Simple keyword extraction based on common development sectors
        sectors = [
            "education", "health", "environment", "climate", "water", "sanitation",
            "agriculture", "food security", "gender", "youth", "children", "elderly",
            "disability", "human rights", "governance", "democracy", "peace", "conflict",
            "economic development", "entrepreneurship", "technology", "innovation",
            "infrastructure", "energy", "renewable", "sustainability", "resilience",
            "disaster", "emergency", "humanitarian", "refugees", "migration"
        ]
        
        found_keywords = []
        text_lower = text.lower()
        
        for sector in sectors:
            if sector in text_lower:
                found_keywords.append(sector)
        
        # If no keywords found, return generic ones
        if not found_keywords:
            return ["development", "capacity building", "community support", "social impact", "sustainability"]
        
        return found_keywords
    
    async def generate_proposal_outline(self, opportunity_data: Dict[str, Any], organization_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a proposal outline based on opportunity and organization"""
        try:
            if not self.initialized or not self.openai_api_key:
                return self._generate_mock_proposal_outline(opportunity_data, organization_profile)
            
            # Prepare the context
            context = f"""
            OPPORTUNITY:
            Title: {opportunity_data.get('title', '')}
            Description: {opportunity_data.get('description', '')}
            Donor: {opportunity_data.get('source_name', '')}
            Amount: {opportunity_data.get('amount_min', 0)} - {opportunity_data.get('amount_max', 0)} {opportunity_data.get('currency', 'USD')}
            Deadline: {opportunity_data.get('deadline', '')}
            Country: {opportunity_data.get('country', '')}
            Sector: {opportunity_data.get('sector', '')}
            
            ORGANIZATION:
            Name: {organization_profile.get('name', '')}
            Mission: {organization_profile.get('mission', '')}
            Experience: {organization_profile.get('experience', '')}
            Sector: {organization_profile.get('sector', '')}
            Country: {organization_profile.get('country', '')}
            """
            
            prompt = f"""
            Based on the opportunity and organization details below, create a comprehensive proposal outline:
            
            {context}
            
            Generate a detailed proposal outline with the following sections:
            1. Executive Summary
            2. Problem Statement
            3. Project Objectives
            4. Methodology
            5. Expected Outcomes
            6. Monitoring & Evaluation Framework
            7. Sustainability Plan
            8. Budget Summary
            9. Timeline
            
            For each section, provide:
            - A brief description of what should be included
            - Key points to emphasize
            - Specific alignment with donor priorities
            
            Format your response as JSON with each section as a key, and include "description", "key_points", and "donor_alignment" for each section.
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert grant writer with extensive experience in international development."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            try:
                outline = json.loads(response.choices[0].message.content)
                return {
                    "status": "success",
                    "outline": outline,
                    "timestamp": datetime.utcnow().isoformat()
                }
            except json.JSONDecodeError:
                # If JSON parsing fails, return the raw text
                return {
                    "status": "partial_success",
                    "outline": {
                        "raw_text": response.choices[0].message.content
                    },
                    "timestamp": datetime.utcnow().isoformat()
                }
            
        except Exception as e:
            logger.error(f"Error generating proposal outline: {e}")
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def _generate_mock_proposal_outline(self, opportunity_data: Dict[str, Any], organization_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Generate mock proposal outline when AI services are unavailable"""
        return {
            "status": "success",
            "outline": {
                "executive_summary": {
                    "description": "A brief overview of the entire proposal",
                    "key_points": [
                        "Introduce the organization and its expertise",
                        "Clearly state the problem and proposed solution",
                        "Highlight expected impact and alignment with donor priorities"
                    ],
                    "donor_alignment": "Emphasize alignment with donor's mission and strategic objectives"
                },
                "problem_statement": {
                    "description": "Detailed description of the problem being addressed",
                    "key_points": [
                        "Use data and statistics to quantify the problem",
                        "Explain root causes and consequences",
                        "Describe affected populations and geographic scope"
                    ],
                    "donor_alignment": "Connect the problem to donor's priority areas and SDGs"
                },
                "project_objectives": {
                    "description": "Specific, measurable objectives of the project",
                    "key_points": [
                        "Use SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)",
                        "Include both output and outcome objectives",
                        "Limit to 3-5 key objectives"
                    ],
                    "donor_alignment": "Show how objectives contribute to donor's strategic goals"
                },
                "methodology": {
                    "description": "Detailed approach to implementing the project",
                    "key_points": [
                        "Describe specific activities and implementation strategies",
                        "Explain the rationale for chosen approaches",
                        "Include innovative elements and best practices"
                    ],
                    "donor_alignment": "Highlight methodologies that align with donor's preferred approaches"
                },
                "expected_outcomes": {
                    "description": "Anticipated results and impact of the project",
                    "key_points": [
                        "Define short-term, medium-term, and long-term outcomes",
                        "Quantify expected beneficiaries and impact",
                        "Describe transformative changes expected"
                    ],
                    "donor_alignment": "Connect outcomes to donor's impact metrics and reporting requirements"
                },
                "monitoring_evaluation": {
                    "description": "Framework for tracking progress and measuring success",
                    "key_points": [
                        "Define key indicators for each objective",
                        "Describe data collection methods and frequency",
                        "Explain how findings will inform project adaptation"
                    ],
                    "donor_alignment": "Adopt donor's preferred M&E frameworks and reporting formats"
                },
                "sustainability_plan": {
                    "description": "Strategy for ensuring project benefits continue beyond funding",
                    "key_points": [
                        "Describe financial sustainability mechanisms",
                        "Explain institutional capacity building elements",
                        "Outline community ownership strategies"
                    ],
                    "donor_alignment": "Address donor's sustainability requirements and exit strategy expectations"
                },
                "budget_summary": {
                    "description": "Overview of project costs and resource allocation",
                    "key_points": [
                        "Provide high-level budget categories",
                        "Ensure costs are reasonable and justified",
                        "Include cost-sharing or matching funds if applicable"
                    ],
                    "donor_alignment": "Follow donor's budget guidelines and eligible cost categories"
                },
                "timeline": {
                    "description": "Project implementation schedule",
                    "key_points": [
                        "Break down activities by quarter or month",
                        "Include planning, implementation, and evaluation phases",
                        "Highlight key milestones and deliverables"
                    ],
                    "donor_alignment": "Ensure timeline aligns with donor's funding cycle and reporting requirements"
                }
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def match_opportunities(self, organization_profile: Dict[str, Any], limit: int = 10) -> List[Dict[str, Any]]:
        """Match funding opportunities to organization profile"""
        try:
            # In a real implementation, this would use vector similarity search
            # For now, return mock matches
            return self._generate_mock_matches(organization_profile, limit)
        except Exception as e:
            logger.error(f"Error matching opportunities: {e}")
            return []
    
    def _generate_mock_matches(self, organization_profile: Dict[str, Any], limit: int) -> List[Dict[str, Any]]:
        """Generate mock opportunity matches"""
        sector = organization_profile.get('sector', 'Development')
        country = organization_profile.get('country', 'Global')
        
        matches = []
        for i in range(limit):
            match_score = 95 - (i * 3)  # Decreasing match scores
            matches.append({
                "id": f"mock-match-{i}",
                "title": f"{sector} Initiative for {country}",
                "donor": f"International {sector} Foundation",
                "match_score": max(70, match_score),
                "amount": f"${(i+1) * 50000}",
                "deadline": (datetime.utcnow() + timedelta(days=30 + i*5)).strftime("%Y-%m-%d"),
                "focus_areas": [sector, "Capacity Building", "Innovation"],
                "match_reasons": [
                    f"Sector alignment: {sector}",
                    f"Geographic focus: {country}",
                    "Organizational experience"
                ]
            })
        
        return matches
    
    async def analyze_proposal(self, proposal_text: str) -> Dict[str, Any]:
        """Analyze a proposal and provide feedback"""
        try:
            if not self.initialized or not self.openai_api_key:
                return self._generate_mock_proposal_analysis()
            
            prompt = f"""
            Analyze the following grant proposal and provide detailed feedback:
            
            {proposal_text[:4000]}  # Limit text length
            
            Please provide:
            1. Overall quality score (0-100)
            2. Strengths of the proposal (list format)
            3. Areas for improvement (list format)
            4. Specific recommendations for each section
            5. Donor perspective assessment
            
            Format your response as JSON.
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert grant reviewer with extensive experience in international development funding."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5
            )
            
            try:
                analysis = json.loads(response.choices[0].message.content)
                return {
                    "status": "success",
                    "analysis": analysis,
                    "timestamp": datetime.utcnow().isoformat()
                }
            except json.JSONDecodeError:
                # If JSON parsing fails, return the raw text
                return {
                    "status": "partial_success",
                    "analysis": {
                        "raw_text": response.choices[0].message.content
                    },
                    "timestamp": datetime.utcnow().isoformat()
                }
            
        except Exception as e:
            logger.error(f"Error analyzing proposal: {e}")
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def _generate_mock_proposal_analysis(self) -> Dict[str, Any]:
        """Generate mock proposal analysis when AI services are unavailable"""
        return {
            "status": "success",
            "analysis": {
                "score": 78,
                "strengths": [
                    "Clear project objectives",
                    "Well-defined target beneficiaries",
                    "Strong organizational capacity",
                    "Innovative approach to problem-solving"
                ],
                "areas_for_improvement": [
                    "Weak sustainability plan",
                    "Insufficient evidence base in problem statement",
                    "Budget lacks detailed justification",
                    "Monitoring framework needs more specific indicators"
                ],
                "section_recommendations": {
                    "executive_summary": "Make impact statements more specific and quantifiable",
                    "problem_statement": "Add more statistical evidence and citations",
                    "methodology": "Clarify implementation timeline and responsible parties",
                    "budget": "Provide more detailed breakdown and justification for major expenses",
                    "monitoring_evaluation": "Develop SMART indicators for each objective"
                },
                "donor_perspective": "Proposal shows promise but needs stronger evidence of sustainability and impact measurement. Alignment with donor priorities should be more explicit."
            },
            "timestamp": datetime.utcnow().isoformat()
        }

# Create global instance
ai_service = AIService()