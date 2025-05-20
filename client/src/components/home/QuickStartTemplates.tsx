import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { useIsMobile } from '@/hooks/use-mobile';

// Template data structure
interface WorkflowStep {
  name: string;
  description: string;
  codeSnippet?: string;
}

interface Template {
  id: string;
  name: string;
  icon: string;
  description: string;
  industry: string;
  color: string;
  techStack: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToImplement: string;
  workflowSteps: WorkflowStep[];
}

// Industry-specific AI workflow templates
const quickStartTemplates: Template[] = [
  {
    id: 'ecommerce-recommendation',
    name: 'Product Recommendation Engine',
    icon: 'fa-cart-shopping',
    industry: 'E-Commerce',
    color: 'from-blue-500 to-indigo-600',
    description: 'Personalized product recommendations based on user browsing history, purchase patterns, and similar customer profiles.',
    techStack: ['Python', 'TensorFlow', 'SQL', 'REST API'],
    complexity: 'Intermediate',
    timeToImplement: '4-6 weeks',
    workflowSteps: [
      {
        name: 'Data Collection & Processing',
        description: 'Gather user behavior data including views, purchases, and cart additions. Clean and prepare for model training.',
        codeSnippet: `// Sample code for data collection
import pandas as pd

# Load user behavior data
user_data = pd.read_csv('user_interactions.csv')
purchase_history = pd.read_csv('purchase_history.csv')

# Process and merge datasets
processed_data = pd.merge(
    user_data, 
    purchase_history,
    on='user_id', 
    how='left'
)

# Feature engineering
processed_data['days_since_last_purchase'] = ...`
      },
      {
        name: 'Model Training',
        description: 'Use collaborative filtering and gradient boosting to identify patterns and predict product affinity.',
        codeSnippet: `from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Embedding

# Create embedding model
model = Sequential([
    Embedding(input_dim=num_users, output_dim=50, input_length=1),
    Flatten(),
    Dense(128, activation='relu'),
    Dense(64, activation='relu'),
    Dense(num_products, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train model
model.fit(
    X_train, 
    y_train,
    epochs=10,
    batch_size=64,
    validation_split=0.2
)`
      },
      {
        name: 'Real-time Recommendation API',
        description: 'Deploy model as API endpoint that delivers personalized product recommendations in milliseconds.',
        codeSnippet: `# Flask API for recommendations
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    user_id = request.json.get('user_id')
    product_id = request.json.get('product_id', None)
    
    # Get personalized recommendations
    if product_id:
        # Item-based recommendations
        recommendations = recommend_similar_products(product_id)
    else:
        # User-based recommendations
        recommendations = recommend_for_user(user_id)
    
    return jsonify({
        'recommendations': recommendations,
        'user_id': user_id
    })`
      }
    ]
  },
  {
    id: 'healthcare-triage',
    name: 'Patient Triage System',
    icon: 'fa-stethoscope',
    industry: 'Healthcare',
    color: 'from-emerald-500 to-teal-600',
    description: 'AI-powered symptom analysis and priority assignment system that helps medical professionals efficiently manage patient intake.',
    techStack: ['Python', 'Natural Language Processing', 'Medical API', 'Web Interface'],
    complexity: 'Advanced',
    timeToImplement: '8-12 weeks',
    workflowSteps: [
      {
        name: 'Patient Input Processing',
        description: 'Parse and analyze patient-reported symptoms using medical NLP to identify key conditions and severity indicators.',
        codeSnippet: `import spacy
from medical_ner import MedicalNER

# Load medical NLP model
nlp = spacy.load('en_core_med_lg')
med_ner = MedicalNER()

def process_patient_symptoms(symptom_text):
    # Process text with medical NLP
    doc = nlp(symptom_text)
    
    # Extract medical entities
    symptoms = []
    for ent in doc.ents:
        if ent.label_ == 'SYMPTOM':
            symptoms.append({
                'name': ent.text,
                'severity': analyze_severity(ent.text, doc)
            })
    
    # Identify potential medical conditions
    conditions = med_ner.extract_conditions(symptom_text)
    
    return {
        'symptoms': symptoms,
        'potential_conditions': conditions
    }`
      },
      {
        name: 'Urgency Classification',
        description: 'Apply medical knowledge base and risk models to classify patient cases by urgency level.',
        codeSnippet: `from medical_knowledge_base import KnowledgeBase
from risk_models import UrgencyClassifier

kb = KnowledgeBase()
classifier = UrgencyClassifier()

def classify_urgency(symptoms, patient_data):
    # Get patient risk factors
    age = patient_data.get('age')
    medical_history = patient_data.get('medical_history', [])
    
    # Calculate base risk score
    base_score = classifier.calculate_base_score(symptoms)
    
    # Apply risk modifiers based on medical history
    risk_score = classifier.apply_history_modifiers(
        base_score, 
        medical_history
    )
    
    # Determine urgency level
    if risk_score > 0.8:
        return 'emergency'
    elif risk_score > 0.5:
        return 'urgent'
    elif risk_score > 0.3:
        return 'standard'
    else:
        return 'routine'`
      },
      {
        name: 'Care Integration',
        description: 'Connect triage results with scheduling and alert systems to direct patients to appropriate care resources.',
        codeSnippet: `from integrations import Scheduler, AlertSystem
from care_paths import CarePathway

scheduler = Scheduler()
alerts = AlertSystem()
care_paths = CarePathway()

def process_triage_result(patient_id, urgency, conditions):
    # Determine appropriate care pathway
    pathway = care_paths.get_pathway(urgency, conditions)
    
    # Schedule according to urgency
    if urgency == 'emergency':
        # Send immediate alerts
        alerts.send_emergency_alert(patient_id, conditions)
        
        # Schedule emergency slot
        appointment = scheduler.schedule_emergency(
            patient_id, 
            conditions
        )
    elif urgency == 'urgent':
        # Schedule urgent care slot
        appointment = scheduler.schedule_urgent(
            patient_id, 
            conditions,
            max_wait_hours=24
        )
    else:
        # Regular scheduling
        appointment = scheduler.schedule_standard(
            patient_id, 
            conditions
        )
    
    return {
        'appointment': appointment,
        'care_pathway': pathway,
        'instructions': pathway.get_patient_instructions()
    }`
      }
    ]
  },
  {
    id: 'finance-fraud',
    name: 'Real-time Fraud Detection',
    icon: 'fa-shield-alt',
    industry: 'Financial Services',
    color: 'from-amber-500 to-orange-600',
    description: 'Transaction monitoring system that uses machine learning to detect and flag potentially fraudulent activities in milliseconds.',
    techStack: ['Python', 'Scikit-learn', 'Kafka', 'PostgreSQL'],
    complexity: 'Advanced',
    timeToImplement: '10-14 weeks',
    workflowSteps: [
      {
        name: 'Real-time Data Stream',
        description: 'Process transaction data streams with low-latency validation and feature extraction.',
        codeSnippet: `from kafka import KafkaConsumer
import json
from feature_extraction import TransactionFeatureExtractor

# Initialize Kafka consumer
consumer = KafkaConsumer(
    'transactions',
    bootstrap_servers=['kafka:9092'],
    auto_offset_reset='latest',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

# Initialize feature extractor
extractor = TransactionFeatureExtractor()

# Process transaction stream
for message in consumer:
    transaction = message.value
    
    # Extract features for fraud detection
    features = extractor.extract_features(transaction)
    
    # Enrich with historical data
    features = extractor.enrich_with_history(
        features, 
        transaction['account_id']
    )
    
    # Send to fraud detection model
    fraud_score = fraud_detector.predict(features)`
      },
      {
        name: 'Multi-model Anomaly Detection',
        description: 'Combine rules-based filters with ML models to accurately identify various fraud patterns.',
        codeSnippet: `from ml_models import AnomalyDetector, BehaviorModel
from rules_engine import FraudRules

# Initialize models
anomaly_model = AnomalyDetector()
behavior_model = BehaviorModel()
rules = FraudRules()

def detect_fraud(transaction_features, account_id):
    # Apply rules-based checks
    rule_violations = rules.check_transaction(
        transaction_features
    )
    
    # Machine learning anomaly detection
    anomaly_score = anomaly_model.score_transaction(
        transaction_features
    )
    
    # User behavior analysis
    behavior_score = behavior_model.compare_to_patterns(
        transaction_features,
        account_id
    )
    
    # Combine scores using ensemble method
    final_score = 0.5 * anomaly_score + 0.3 * behavior_score
    
    # Add rule violation penalties
    if rule_violations:
        final_score += 0.2 * len(rule_violations)
    
    return {
        'fraud_score': min(final_score, 1.0),
        'rule_violations': rule_violations,
        'is_fraudulent': final_score > 0.7
    }`
      },
      {
        name: 'Response Orchestration',
        description: 'Automate appropriate responses based on fraud probability, from allowing transactions to triggering investigations.',
        codeSnippet: `from notification import AlertSystem
from case_management import FraudCase
from transaction_service import TransactionService

alerts = AlertSystem()
case_system = FraudCase()
tx_service = TransactionService()

def handle_fraud_detection(transaction, fraud_result):
    # Extract data
    account_id = transaction['account_id']
    transaction_id = transaction['id']
    fraud_score = fraud_result['fraud_score']
    
    if fraud_score > 0.9:
        # High confidence fraud - block and alert
        tx_service.block_transaction(transaction_id)
        alerts.send_high_priority(account_id, transaction)
        case_system.create_fraud_case(
            transaction, 
            fraud_result,
            priority='high'
        )
        
    elif fraud_score > 0.7:
        # Suspicious - flag for review
        tx_service.flag_transaction(transaction_id)
        case_system.create_fraud_case(
            transaction, 
            fraud_result,
            priority='medium'
        )
        
    elif fraud_score > 0.4:
        # Low confidence - monitor
        tx_service.allow_transaction(transaction_id)
        alerts.add_to_monitoring(account_id, transaction)
        
    else:
        # Likely legitimate
        tx_service.allow_transaction(transaction_id)`
      }
    ]
  },
  {
    id: 'manufacturing-predictive',
    name: 'Predictive Maintenance System',
    icon: 'fa-industry',
    industry: 'Manufacturing',
    color: 'from-blue-600 to-blue-800',
    description: 'IoT sensor monitoring and analysis platform that predicts equipment failures before they happen, reducing downtime and maintenance costs.',
    techStack: ['Python', 'IoT', 'Time Series Analysis', 'Dashboard'],
    complexity: 'Intermediate',
    timeToImplement: '6-8 weeks',
    workflowSteps: [
      {
        name: 'Sensor Data Collection',
        description: 'Gather and process data from IoT sensors monitoring equipment vibration, temperature, and performance metrics.',
        codeSnippet: `import paho.mqtt.client as mqtt
import json
from datetime import datetime
from database import SensorDataRepository

# Initialize database connection
repo = SensorDataRepository()

# MQTT client setup
client = mqtt.Client()
client.username_pw_set("iot_user", "password")
client.connect("mqtt.factory.example", 1883, 60)

# Handle incoming sensor data
def on_message(client, userdata, msg):
    try:
        # Parse sensor data
        payload = json.loads(msg.payload)
        
        # Add timestamp
        payload['timestamp'] = datetime.now().isoformat()
        
        # Extract device info
        device_id = payload.get('device_id')
        sensor_type = payload.get('sensor_type')
        
        # Store raw sensor data
        repo.store_sensor_reading(
            device_id=device_id,
            sensor_type=sensor_type,
            reading=payload
        )
        
        # Process for anomalies
        process_sensor_data(payload)
        
    except Exception as e:
        print(f"Error processing message: {e}")

client.on_message = on_message
client.subscribe("factory/sensors/#")
client.loop_start()`
      },
      {
        name: 'Failure Prediction Model',
        description: 'Analyze patterns in sensor data to predict potential equipment failures hours or days before they occur.',
        codeSnippet: `import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from feature_engineering import extract_time_features

# Load historical sensor data with failure labels
data = repo.get_historical_sensor_data_with_failures()

# Feature engineering
X = extract_time_features(data)
y = data['failure_within_24h']  # Binary label

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train failure prediction model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Evaluate model
accuracy = model.score(X_test, y_test)
print(f"Model accuracy: {accuracy:.2f}")

# Feature importance analysis
importances = model.feature_importances_
indices = np.argsort(importances)[::-1]
feature_names = X.columns

print("Feature ranking:")
for i in range(10):  # Top 10 features
    print(f"{i+1}. {feature_names[indices[i]]} ({importances[indices[i]]})")`
      },
      {
        name: 'Maintenance Optimization',
        description: 'Generate optimal maintenance schedules that minimize disruption while preventing costly failures.',
        codeSnippet: `from optimization import MaintenanceScheduler
from notification import MaintenanceAlerts

scheduler = MaintenanceScheduler()
alerts = MaintenanceAlerts()

def schedule_predictive_maintenance(equipment_id, failure_prediction):
    # Get equipment details
    equipment = equipment_repo.get_equipment(equipment_id)
    
    # Get current production schedule
    production = scheduler.get_production_schedule(
        start_date=datetime.now(),
        days=7
    )
    
    # Calculate failure probability over time
    failure_prob = failure_prediction['probability']
    estimated_time = failure_prediction['estimated_time_to_failure']
    
    # Determine maintenance urgency
    if failure_prob > 0.8 and estimated_time < 24:
        # Critical - immediate maintenance needed
        maintenance_window = scheduler.find_immediate_window(
            equipment_id,
            production
        )
        alerts.send_critical_alert(equipment_id, failure_prediction)
        
    elif failure_prob > 0.6 and estimated_time < 72:
        # High priority - schedule within 48 hours
        maintenance_window = scheduler.find_optimal_window(
            equipment_id,
            production,
            max_hours=48
        )
        alerts.send_high_priority_alert(equipment_id, failure_prediction)
        
    else:
        # Plan during normal maintenance cycles
        maintenance_window = scheduler.schedule_next_maintenance(
            equipment_id,
            failure_prediction
        )
    
    # Return maintenance plan
    return {
        'equipment_id': equipment_id,
        'maintenance_window': maintenance_window,
        'required_parts': equipment.get_maintenance_parts(),
        'estimated_duration': equipment.get_service_duration()
    }`
      }
    ]
  },
  {
    id: 'retail-inventory',
    name: 'Smart Inventory Optimization',
    icon: 'fa-boxes-stacked',
    industry: 'Retail',
    color: 'from-purple-500 to-purple-800',
    description: 'AI-powered inventory management system that predicts demand, optimizes stock levels, and automates reordering to reduce costs.',
    techStack: ['Python', 'Forecasting', 'SQL', 'Dashboard'],
    complexity: 'Intermediate',
    timeToImplement: '5-7 weeks',
    workflowSteps: [
      {
        name: 'Sales Data Analysis',
        description: 'Process historical sales data to identify patterns, seasonality, and key demand drivers by product and location.',
        codeSnippet: `import pandas as pd
from statsmodels.tsa.seasonal import seasonal_decompose

# Load sales data
sales_data = pd.read_csv('sales_history.csv')
sales_data['date'] = pd.to_datetime(sales_data['date'])
sales_data.set_index('date', inplace=True)

# Aggregate sales by product and location
def analyze_product_sales(product_id, store_id=None):
    # Filter data
    if store_id:
        product_sales = sales_data[
            (sales_data['product_id'] == product_id) & 
            (sales_data['store_id'] == store_id)
        ]['quantity']
    else:
        product_sales = sales_data[
            sales_data['product_id'] == product_id
        ]['quantity'].groupby('date').sum()
    
    # Resample to daily frequency and fill gaps
    daily_sales = product_sales.resample('D').sum().fillna(0)
    
    # Decompose time series
    if len(daily_sales) > 14:  # Need sufficient data
        decomposition = seasonal_decompose(
            daily_sales, 
            model='multiplicative',
            period=7  # Weekly seasonality
        )
        
        return {
            'trend': decomposition.trend,
            'seasonal': decomposition.seasonal,
            'residual': decomposition.resid,
            'daily_avg': daily_sales.mean(),
            'daily_std': daily_sales.std()
        }
    else:
        return {
            'daily_avg': daily_sales.mean(),
            'daily_std': daily_sales.std()
        }`
      },
      {
        name: 'Demand Forecasting',
        description: 'Generate accurate sales predictions that account for trends, seasonality, promotions, and external factors.',
        codeSnippet: `from prophet import Prophet
import pandas as pd
from external_factors import get_weather_forecast, get_event_calendar

def forecast_product_demand(product_id, store_id, days=30):
    # Prepare data for Prophet
    sales = get_product_sales_history(product_id, store_id)
    df = pd.DataFrame({
        'ds': sales.index,
        'y': sales.values
    })
    
    # Add holiday/events information
    events = get_event_calendar(store_id, days=days)
    holidays_df = pd.DataFrame({
        'holiday': events['name'],
        'ds': pd.to_datetime(events['date']),
        'lower_window': -1,
        'upper_window': 1
    })
    
    # Create and fit model
    model = Prophet(
        holidays=holidays_df,
        daily_seasonality=False,
        weekly_seasonality=True,
        yearly_seasonality=True
    )
    
    # Add weather as regressor if available
    weather = get_weather_forecast(store_id, days=days)
    if weather is not None:
        df['weather'] = weather['historical']
        model.add_regressor('weather')
    
    # Fit model
    model.fit(df)
    
    # Create future dataframe
    future = model.make_future_dataframe(periods=days)
    
    # Add weather forecast to future data
    if weather is not None:
        future['weather'] = weather['forecast']
    
    # Generate forecast
    forecast = model.predict(future)
    
    return {
        'dates': forecast['ds'][-days:],
        'predicted_demand': forecast['yhat'][-days:],
        'lower_bound': forecast['yhat_lower'][-days:],
        'upper_bound': forecast['yhat_upper'][-days:]
    }`
      },
      {
        name: 'Inventory Optimization',
        description: 'Calculate optimal order quantities and reorder points that balance inventory costs with stockout risks.',
        codeSnippet: `from optimization import calculate_economic_order_quantity
from inventory_models import SafetyStock

def optimize_inventory_levels(product_id, store_id, forecast):
    # Get product and store details
    product = product_repo.get_product(product_id)
    store = store_repo.get_store(store_id)
    
    # Calculate Economic Order Quantity
    eoq = calculate_economic_order_quantity(
        annual_demand=forecast['annual_demand'],
        order_cost=product.ordering_cost,
        holding_cost_pct=store.holding_cost_percentage,
        unit_cost=product.unit_cost
    )
    
    # Calculate safety stock level
    safety_stock = SafetyStock.calculate(
        lead_time_days=product.supplier_lead_time,
        demand_daily_std=forecast['demand_std'],
        service_level=store.service_level_target
    )
    
    # Calculate reorder point
    reorder_point = (product.supplier_lead_time * 
                    forecast['daily_avg']) + safety_stock
    
    # Generate recommended order schedule
    order_schedule = generate_order_schedule(
        product_id=product_id,
        store_id=store_id,
        current_stock=store.get_product_stock(product_id),
        forecast=forecast,
        eoq=eoq,
        reorder_point=reorder_point
    )
    
    return {
        'economic_order_quantity': eoq,
        'safety_stock': safety_stock,
        'reorder_point': reorder_point,
        'next_order_date': order_schedule['next_order_date'],
        'next_order_quantity': order_schedule['next_order_quantity']
    }`
      }
    ]
  }
];

interface QuickStartTemplatesProps {
  categoryFilter?: string;
}

export default function QuickStartTemplates({ categoryFilter }: QuickStartTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(quickStartTemplates[0].id);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const isMobile = useIsMobile();
  
  // Filter templates by category if categoryFilter is provided
  const filteredTemplates = categoryFilter && categoryFilter !== 'all'
    ? quickStartTemplates.filter(template => {
        // Match templates with the category filter
        return template.industry.toLowerCase().includes(categoryFilter.toLowerCase());
      })
    : quickStartTemplates;
  
  // If we have filtered templates and the current selection is not in the filtered list,
  // select the first template from the filtered list
  useEffect(() => {
    if (filteredTemplates.length > 0 && !filteredTemplates.some(t => t.id === selectedTemplate)) {
      setSelectedTemplate(filteredTemplates[0].id);
    }
  }, [categoryFilter, selectedTemplate]);
  
  const template = filteredTemplates.find(t => t.id === selectedTemplate) || 
    (filteredTemplates.length > 0 ? filteredTemplates[0] : quickStartTemplates[0]);

  return (
    <section id="quick-start-templates" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
            Quick Start <GradientText>Templates</GradientText>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Industry-specific AI workflow examples with code and implementation guides to jumpstart your AI projects
          </motion.p>
        </motion.div>
        
        {/* Template selection cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {quickStartTemplates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all duration-300 border ${
                selectedTemplate === template.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/30'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center text-white text-xl mb-3`}>
                  <i className={`fas fa-${template.icon}`}></i>
                </div>
                <h3 className="font-medium mb-1 line-clamp-1">{template.name}</h3>
                <p className="text-xs text-muted-foreground">{template.industry}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Selected template details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          key={template.id}
          className="bg-background/30 backdrop-blur-sm rounded-xl border border-border p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center mb-8 gap-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center text-white text-2xl`}>
              <i className={`fas fa-${template.icon}`}></i>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{template.name}</h3>
              <p className="text-muted-foreground mt-1">{template.description}</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Badge variant="outline" className="bg-background/50">
                {template.complexity}
              </Badge>
              <Badge variant="outline" className="bg-background/50">
                {template.timeToImplement}
              </Badge>
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="text-lg font-medium mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {template.techStack.map((tech, index) => (
                <Badge key={index} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Implementation Workflow</h4>
            <div className="space-y-4">
              {template.workflowSteps.map((step, index) => (
                <Card 
                  key={index} 
                  className="border-border overflow-hidden"
                >
                  <CardContent className={`p-0 ${expandedStep === index ? '' : 'cursor-pointer'}`}>
                    <div 
                      className="p-4 flex items-center gap-3"
                      onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${template.color} flex items-center justify-center text-white text-sm font-medium`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{step.name}</h5>
                        <p className="text-sm text-muted-foreground line-clamp-1">{step.description}</p>
                      </div>
                      <div className="text-muted-foreground">
                        <i className={`fas fa-chevron-${expandedStep === index ? 'up' : 'down'}`}></i>
                      </div>
                    </div>
                    
                    {expandedStep === index && step.codeSnippet && (
                      <div className="border-t border-border">
                        <div className="bg-black/80 p-4 overflow-x-auto">
                          <pre className="text-xs md:text-sm text-gray-300 font-mono">
                            <code>{step.codeSnippet}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <CardFooter className="px-0 pt-8 pb-0 flex flex-col sm:flex-row gap-4 justify-center">
            <Button className={`bg-gradient-to-r ${template.color} hover:opacity-90`}>
              Download Template
            </Button>
            <Button variant="outline">
              View Documentation
            </Button>
          </CardFooter>
        </motion.div>
      </div>
    </section>
  );
}