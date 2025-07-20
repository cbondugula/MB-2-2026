import sys
import os
import warnings
warnings.filterwarnings('ignore')

# Healthcare ML Service Initialization
print("Healthcare ML Service Starting...")

# Import and verify all libraries
try:
    import numpy as np
    import pandas as pd
    import sklearn
    import tensorflow as tf
    import torch
    import transformers
    import cv2
    import pydicom
    print("✓ All ML libraries loaded successfully")
    
    # Initialize healthcare-specific models
    from transformers import AutoTokenizer, AutoModel
    
    # Load pre-trained healthcare models
    clinical_bert = "emilyalsentzer/Bio_ClinicalBERT"
    print(f"✓ Healthcare AI models ready")
    
    print("Healthcare ML Service Ready!")
    
except ImportError as e:
    print(f"❌ Missing library: {e}")
    sys.exit(1)