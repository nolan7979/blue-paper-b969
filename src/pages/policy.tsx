import { BasicLayout } from '@/components/layout';
import Seo from '@/components/Seo';

const PolicyPage = () => {
  return (
    <div className='bddev h-full'>
      {/* <Seo templateTitle='Home' /> */}
      {/* <Seo templateTitle='About' /> */}

      <div className="bg-gray-100 text-gray-800">
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy of www.uniscore.com</h1>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
            <p className="mb-2">This privacy policy concerns the products of uniscore (anything marked as ‘we, us, our’ and similar in this policy will refer to uniscore) – our website www.uniscore.com and our mobile applications. In order to provide our services, we have to collect some personal data. This privacy policy explains what data do we collect, how and why do we process and keep it, how you can contact us and find out about your privacy rights, as well as show our commitment to protection of your information.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">2. Data Controller and Owner</h2>
            <p className="mb-2">The owner of www.uniscore.com. You can contact us by e-mail on the address <a href="mailto:info@uniscore.com" className="text-blue-600">info@uniscore.com</a></p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">3. Third-Party Links</h2>
            <p className="mb-2">Please do keep in mind that we aren’t in control of the data our partner websites collect and share. While we are committed to guarding your privacy and safety in every way possible, if you’re leaving uniscore.com by clicking on a plug-in or a link you find on our site, personal data they collect is out of our hands. We strongly recommend you to read the privacy policies of those sites first.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">4. Types of Data Collected</h2>

            <h3 className="text-xl font-semibold mb-2">4.1 Collected Data</h3>
            <p className="mb-2">Among the types of personal data that we collect, by itself or through third parties, are: Email, Cookie and Usage Data. If we need any other personal data collected at some point, it will either be described in other sections of this privacy policy or by dedicated explanation text contextually with the data collection, meaning you will be asked and fully informed about it. That means the personal data we collect may be freely provided by the user, or collected.</p>

            <h3 className="text-xl font-semibold mb-2">4.2 User Account</h3>
            <p className="mb-2">In order to provide a better service for our users, we have — for a long time — had a feature of user account. Now, with your privacy more important than ever before, we are clarifying the way your personal data concerning user account is collected and stored.</p>
            <p className="mb-2">Personal data refers to information that can identify you, such as your name, e-mail address, or any data you provide while using uniscore user account. Our login providers (Facebook or Google) provide us with some of your personal data — name, surname, e-mail — upon your login to our services. However, your personal information of that kind will never be sold or rented to anyone, for any reason, at any time. We will not store this information in any available database. This information will only be used to easier fulfill your requests for service, such as providing access to your in-app stats and features, and to enforce our Terms of Use.</p>

            <h3 className="text-xl font-semibold mb-2">4.3 Not-Collected Data</h3>
            <p className="mb-2">At no point do we collect personal or sensitive personal data that could lead to a person being positively identified. Also, we never collect the data about race or ethnic origin, political opinions, religious or philosophical beliefs, trade union memberships, genetic or biometric data, health or mortality, sex life or sexual orientation, unless we are legally required by the court of law to do it.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">5. Mode and Place of Processing the Data</h2>

            <h3 className="text-xl font-semibold mb-2">5.1 Method of Processing</h3>
            <p className="mb-2">Our Data Controller processes the data of our users in proper manner and shall take appropriate security measures to prevent unauthorized access, disclosure, modification or unauthorized destruction of the data.</p>
            <p className="mb-2">The data processing itself is carried out using computers and/or IT enabled tools, following organizational procedures and modes strictly related to the purposes indicated. In addition to the Data Controller, in some cases, the data may be accessible to certain types of persons in charge, involved with the operation of the site (administration, sales, marketing, legal, system administration) or external parties (such as third party technical service providers, mail carriers, hosting providers, IT companies, communications agencies) appointed, if necessary, as data processors.</p>
            <p className="mb-2">What is important is that the updated list of these parties may be requested from the Data Controller at any time, so you will always know who is in charge.</p>

            <h3 className="text-xl font-semibold mb-2">5.2 Place of Processing</h3>
            <p className="mb-2">The data is processed at the Data Controller’s operating offices and in any other places where the parties involved with the processing are located. For further information, please contact the Data Controller.</p>

            <h3 className="text-xl font-semibold mb-2">5.3 Conservation Time</h3>
            <p className="mb-2">We keep the data for the time necessary to provide the service requested by the user, or stated by the purposes outlined in this document. You can always, at any time, and for any reason, request the Data Controller for the suspension or removal of your data.</p>
            <p className="mb-2">If you need to delete your account data, please visit the following URL: <a href="https://www.uniscore.com/account-deletion" className="text-blue-600">https://www.uniscore.com/account-deletion</a></p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">6. The Use of the Collected Data</h2>
            <p className="mb-2">The data concerning the user is collected to allow us to provide our services, as well as for the following purposes: contacting the user and displaying content from external platforms.</p>

            <h3 className="text-xl font-semibold mb-2">6.1 Contacting the User</h3>
            <p className="mb-2">Mailing List or Newsletter (This Application) Personal Data collected in this case is your e-mail address.</p>
            <p className="mb-2">By registering to the mailing list or to the newsletter, the user’s email address will be added to the contact list of those who may receive email messages containing information of commercial or promotional nature concerning our product.</p>

            <h3 className="text-xl font-semibold mb-2">6.2 Displaying Content from External Platforms</h3>
            <p className="mb-2">Personal Data collected in this case are your Cookie and Usage Data.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">7. Further Information about Personal Data</h2>

            <h3 className="text-xl font-semibold mb-2">7.1 Push Notifications</h3>
            <p className="mb-2">We may send push notifications to you. Push notification may include alerts, sounds, icon badges and other information in relation to the use of our products. You can choose to allow or reject push notifications being sent to your device — if you do not allow us to send you push notifications, you will still be able to use our products freely, but you may not get the full benefit of the features. You can control your preferences to receive push notifications via your device settings.</p>

            <h3 className="text-xl font-semibold mb-2">7.2 Unique Device Identification</h3>
            <p className="mb-2">Sometimes, our products may store some unique identifiers of your device, only for analytics purposes or for storing your preferences.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">8. Additional Information about Data Collection and Processing</h2>

            <h3 className="text-xl font-semibold mb-2">8.1 Legal Actions</h3>
            <p className="mb-2">As we already mentioned, your data may be used for legal purposes by the Data Controller, in Court or in the stages leading to possible legal action arising from improper use of our products or the related services.</p>

            <h3 className="text-xl font-semibold mb-2">8.2 System Logs and Maintenance</h3>
            <p className="mb-2">For operation and maintenance purposes, we may sometimes collect files that record your interaction with our products (so called System Logs) or use for this purpose other personal data (such as IP Address). That data won’t be stored permanently and won’t be available to sell or rent to anyone.</p>

            <h3 className="text-xl font-semibold mb-2">8.3 Your Rights</h3>
            <p className="mb-2">When it comes to having access to your personal data, you have the biggest rights. By submitting a user access request, we will provide you the following information free of charge:</p>
            <ul className="list-disc pl-5 mb-2">
              <li>What personal information pertaining to you is being processed</li>
              <li>Why this information is being processed</li>
              <li>Who has access to this personal information about you</li>
              <li>How this personal information is being used in automated decisions</li>
              <li>What processes are using this information</li>
            </ul>
            <p className="mb-2">A user access request should be completed within 30 days and include a copy of the personal information, so we can be sure it’s you asking, and not some impersonator.</p>
            <p className="mb-2">Keep in mind our products do not support “do not track” requests. To understand if any of the third party services we use honor the “do not track” requests, please read their privacy policies.</p>

            <h3 className="text-xl font-semibold mb-2">8.4 More Info</h3>
            <p className="mb-2">More details concerning the collection or processing of personal data may be requested from the Data Controller at any time at its contact information. The Data Controller also has the right to make changes to this privacy policy at any time by giving notice to you on this page. It is strongly recommended to check this page often, referring to the date of the last modification listed at the bottom. If you object to any of the changes to the policy — which is your legitimate right — please request from us to erase the personal data so you can cease using our products. Unless stated otherwise, the then-current privacy policy applies to all personal data the Data Controller has about users. The Data Controller is responsible for this privacy policy.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">9. Legal Information</h2>
            <p className="mb-2">This privacy policy was last updated on July 20, 2024.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">10. Contact</h2>
            <p className="mb-2">Please email us at <a href="mailto:info@uniscore.com" className="text-blue-600">info@uniscore.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

PolicyPage.Layout = BasicLayout;

export default PolicyPage;
