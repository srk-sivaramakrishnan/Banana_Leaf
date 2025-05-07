'use client';
import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
  Search,
  Leaf,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';

// Define the type for a support topic
type SupportTopic = {
  question: string;
  answer: string;
  category: string;
};

export default function Support() {
  const [supportTopics, setSupportTopics] = useState<SupportTopic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [contactFormVisible, setContactFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const formRef = useRef<HTMLDivElement | null>(null);

  // Toggle FAQ item expansion
  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Handle contact form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Your message has been sent! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setContactFormVisible(false);
  };

  // Filter topics based on search query
  const filteredTopics = supportTopics.filter(
    (topic) =>
      topic.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Simulating fetch of support content
    setSupportTopics([
      {
        question: 'How do I upload a banana leaf image?',
        answer:
          'Go to the "Predict Disease" section, click "Upload", and select your image. Our system accepts high-quality images of banana leaves in proper lighting conditions for the most accurate results.',
        category: 'Usage',
      },
      {
        question: 'What types of images are supported?',
        answer:
          'Only clear images of banana leaves in JPG or PNG format are supported. The image should be well-lit, focused on the leaf, and ideally taken during daylight. Avoid blurry images or those with heavy shadows for best results.',
        category: 'Technical',
      },
      {
        question: 'How accurate is the disease prediction?',
        answer:
          'The model is trained with over 95% accuracy on our test dataset, but environmental factors can affect results. For the most accurate predictions, ensure good lighting, clear focus, and include the entire leaf in the frame.',
        category: 'Accuracy',
      },
      {
        question: 'Who do I contact for technical support?',
        answer:
          'You can reach us at [support@bananaleafai.com](mailto:support@bananaleafai.com) or use the contact form below. Our support team is available Monday through Friday, 9 AM to 5 PM EST.',
        category: 'Contact',
      },
      {
        question: 'Can I use the tool on mobile devices?',
        answer:
          'Yes, our tool is fully responsive and works on mobile devices with a camera. You can take photos directly with your device and upload them for immediate analysis in the field.',
        category: 'Usage',
      },
      {
        question: 'How often is the AI model updated?',
        answer:
          'We update our model quarterly with new training data to improve accuracy and detection capabilities. Each update is thoroughly tested before deployment.',
        category: 'Technical',
      },
    ]);
  }, []);

  // Scroll to contact form when it becomes visible
  useEffect(() => {
    if (contactFormVisible && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [contactFormVisible]);

  return (
    <DashboardLayout>
      {/* Hero section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <Leaf className="h-8 w-8 text-green-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Support Center</h1>
          </div>
          <p className="text-lg text-gray-700 mb-6 max-w-3xl">
            Find answers to common questions and get help with using the Banana Leaf Disease Prediction tool.
          </p>

          {/* Search box */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border text-black border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center"
            onClick={() => window.open('/chatbot', '_self')}
          >
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2 text-black">Chat with AI Assistant</h3>
            <p className="text-gray-600 text-sm mb-3">Get instant answers from our Banana Leaf AI assistant</p>
            <ArrowRight className="h-5 w-5 text-green-500" />
          </div>
          
          <div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center"
            onClick={() => window.open('/documentation', '_self')}
          >
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2 text-black">Documentation</h3>
            <p className="text-gray-600 text-sm mb-3">Detailed guides on using our disease prediction tools</p>
            <ArrowRight className="h-5 w-5 text-green-500" />
          </div>
          
          <div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center"
            onClick={() => setContactFormVisible(true)}
          >
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2 text-black">Contact Support</h3>
            <p className="text-gray-600 text-sm mb-3">Get help from our dedicated support team</p>
            <ArrowRight className="h-5 w-5 text-green-500" />
          </div>
        </div>

        {/* FAQ section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
          
          {filteredTopics.length > 0 ? (
            <div className="space-y-4">
              {filteredTopics.map((topic, index) => (
                <div 
                  key={index} 
                  className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden transition-all duration-200"
                >
                  <div 
                    className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="flex items-start">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3 mt-1">
                        {topic.category}
                      </span>
                      <h3 className="text-lg font-medium text-gray-800">{topic.question}</h3>
                    </div>
                    {expandedIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  
                  {expandedIndex === index && (
                    <div className="p-5 pt-0 border-t border-gray-100">
                      <p className="text-gray-600">{topic.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
              <button 
                className="mt-3 text-green-600 hover:text-green-700"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Contact form */}
        {contactFormVisible && (
          <div ref={formRef} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Contact Support</h2>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setContactFormVisible(false)}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Not finding what you need section */}
        {!contactFormVisible && (
          <div className="bg-green-50 rounded-xl p-6 text-center mb-10">
            <h3 className="text-lg font-semibold mb-2 text-black">Not finding what you need?</h3>
            <p className="text-gray-600 mb-4">Our support team is ready to help with any questions you might have</p>
            <button 
              onClick={() => setContactFormVisible(true)}
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}