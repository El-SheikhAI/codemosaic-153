"""
CodeMosaic Basic Usage Demonstration

This module illustrates the fundamental capabilities of CodeMosaic, our advanced 
AST-based code assembler. Through deliberate application of abstract syntax tree 
manipulation and fragment-based composition, we demonstrate automated generation 
of production-grade code templates.

Key Concepts Demonstrated:
1. Template initialization and configuration
2. Fragment definition with AST pattern-matching
3. Dynamic placeholder resolution
4. Multi-fragment assembly patterns
"""

from codemosaic.core import MosaicTemplate
from codemosaic.fragments import FunctionFragment, ClassFragment, ControlFlowFragment

# Initialize template with optimization profile
template = MosaicTemplate(
    name="DataProcessor",
    optimization_level="O3",
    language="python"
)

# Define core processing function
process_function = FunctionFragment(
    name="transform_data",
    parameters=["input_data: list", "config: dict"],
    return_type="pd.DataFrame",
    body="""
    # Data normalization pipeline
    processed = [
        ${processing_operation}(item, **config) 
        for item in input_data
    ]
    return pd.DataFrame(processed)
    """
)

# Configure class structure
processor_class = ClassFragment(
    name="DataProcessor",
    bases=["BaseTransformer"],
    attrs={
        "MAX_BATCH_SIZE": 1000,
        "DEFAULTS": {"threshold": 0.85}
    },
    methods=[process_function]
)

# Add validation control flow
validation_logic = ControlFlowFragment(
    guard_condition="len(input_data) > MAX_BATCH_SIZE",
    error_type="ValueError",
    error_message="Input batch exceeds maximum allowed size",
    body="""if ${guard_condition}:
        raise ${error_type}(${error_message})"""
)

# Assemble components
template.add_fragments([processor_class, validation_logic])

# Contextual variable binding
context = {
    'processing_operation': 'normalize_with_threshold',
    'guard_condition': 'len(input_data) > self.MAX_BATCH_SIZE'
}

# Generate optimized template
rendered_code = template.render(context=context)
print("Generated Code:\n")
print(rendered_code)

"""
Expected Output Structure:

class DataProcessor(BaseTransformer):
    MAX_BATCH_SIZE = 1000
    DEFAULTS = {'threshold': 0.85}
    
    def transform_data(self, input_data: list, config: dict) -> pd.DataFrame:
        # Data normalization pipeline
        processed = [
            normalize_with_threshold(item, **config)
            for item in input_data
        ]
        if len(input_data) > self.MAX_BATCH_SIZE:
            raise ValueError("Input batch exceeds maximum allowed size")
        return pd.DataFrame(processed)
"""