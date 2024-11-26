# Case Analysis Tool

## Introduction

The **Case Analysis Tool** is a Node.js-based project designed to streamline the review of medical records for healthcare professionals. By integrating key functionalities such as diagnoses retrieval, research gathering, information summarization, and user-friendly visualizations, the tool aims to enhance clinical workflows and enable efficient decision-making.

---

## Features

1. **Diagnoses Retrieval**  
   Extracts potential diagnoses from medical records using advanced APIs.

2. **Research Gathering**  
   Fetches related studies and abstracts from trusted databases like PubMed.

3. **Information Summarization**  
   Provides concise summaries of research findings, enabling quick decision-making.

4. **Frontend Visualization**  
   Displays results in an organized, visually appealing web interface.

---

## System Pipeline

The tool processes input data through the following stages:

1. **Input Processing**: Extracts text from medical record PDFs.
2. **Diagnoses Retrieval**: Lists potential diagnoses using external APIs.
3. **Research Gathering**: Searches for related studies using a web crawler.
4. **Information Summarization**: Generates brief summaries of findings.
5. **Frontend Visualization**: Presents data via an interactive HTML page.

---

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have the latest stable version of Node.js installed.
- **npm/yarn**: Package manager to install dependencies.
- **Google Med API Key**: For diagnoses retrieval.
- **PubMed API Key**: For research gathering.
- **Gemini API Key**: For summarization functionality.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/case-analysis-tool.git
   ```

2. Navigate to the project directory:

   ```bash
   cd case-analysis-tool
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure environment variables:
   - Create a `.env` file in the project root.
   - Add the following keys:
  
     ```env
      export GOOGLE_MED_API_KEY=your-google-med-api-key

     ```

---

## Usage

1. Place case file under case folder and set the file name to sample_case.pdf
2. start the server:

   ```bash
   npm start
   ```

3. Review the results, including diagnoses, research, and summaries, on the generated dashboard.

---

## Improvements

Future enhancements include:

- Direct file processing using advanced language model APIs.
- Improved diagnoses retrieval through Google Healthcare Models and prompt engineering.
- More refined research filtering with keyword expansion.
- Enhanced visualizations for better data accessibility.

---

## Acknowledgments

- Gemini API
- Node.js and open-source libraries
