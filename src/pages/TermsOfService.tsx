import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-primary">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-background-card border border-border-primary rounded-lg p-8">
          <h1 className="text-3xl font-bold text-text-primary mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none text-text-secondary">
            <p className="text-sm text-text-secondary mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Elev8 Cleaning Solutions' services, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">2. Services Provided</h2>
              <p className="mb-4">Elev8 Cleaning Solutions provides professional cleaning services including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Window washing and cleaning</li>
                <li>Pressure washing services</li>
                <li>Roof and gutter cleaning</li>
                <li>Exterior building cleaning</li>
                <li>Solar panel cleaning</li>
                <li>Other related cleaning services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">3. Service Area</h2>
              <p>
                Our services are available in the Greater Austin Area. Specific service availability may vary by location. 
                Please contact us to confirm service availability in your area.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">4. Scheduling and Cancellation</h2>
              <p className="mb-4">
                <strong>Scheduling:</strong> Services must be scheduled in advance. We will confirm your appointment 
                and provide an estimated time of arrival.
              </p>
              <p className="mb-4">
                <strong>Cancellation:</strong> Cancellations must be made at least 24 hours in advance. 
                Same-day cancellations may be subject to a cancellation fee.
              </p>
              <p>
                <strong>Weather:</strong> Services may be rescheduled due to inclement weather conditions for safety reasons.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">5. Payment Terms</h2>
              <p className="mb-4">
                <strong>Payment:</strong> Payment is due upon completion of services unless other arrangements have been made.
              </p>
              <p className="mb-4">
                <strong>Methods:</strong> We accept cash, check, and major credit cards.
              </p>
              <p>
                <strong>Late Payments:</strong> Late payments may be subject to additional fees and interest charges.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">6. Liability and Insurance</h2>
              <p className="mb-4">
                Elev8 Cleaning Solutions is fully licensed and insured. We maintain comprehensive liability insurance 
                to protect our customers and their property.
              </p>
              <p className="mb-4">
                <strong>Property Damage:</strong> In the unlikely event of property damage caused by our services, 
                we will work with you and our insurance provider to resolve the matter promptly.
              </p>
              <p>
                <strong>Limitations:</strong> Our liability is limited to the cost of the services provided. 
                We are not responsible for pre-existing damage or conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">7. Customer Responsibilities</h2>
              <p className="mb-4">Customers are responsible for:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Providing safe and reasonable access to work areas</li>
                <li>Securing or removing fragile items from work areas</li>
                <li>Informing us of any special conditions or concerns</li>
                <li>Ensuring pets are secured during service</li>
                <li>Providing accurate contact information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">8. Quality Guarantee</h2>
              <p>
                We stand behind our work with a satisfaction guarantee. If you are not completely satisfied with our services, 
                please contact us within 24 hours, and we will work to resolve any issues at no additional charge.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">9. Privacy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our services, 
                to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">10. Modifications</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting 
                on our website. Your continued use of our services constitutes acceptance of any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">11. Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-background-primary border border-border-primary rounded-lg p-4">
                <p><strong>Email:</strong> contact@elev8texas.com</p>
                <p><strong>Phone:</strong> (512) 701-8085</p>
                <p><strong>Service Area:</strong> Greater Austin Area</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">12. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the State of Texas, 
                without regard to its conflict of law provisions.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-border-primary">
            <Link 
              to="/" 
              className="inline-flex items-center text-gold-500 hover:text-gold-400 transition-colors duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService; 