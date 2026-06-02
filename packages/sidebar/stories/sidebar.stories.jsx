import React from 'react';
import SvgIcon from '@m-next/svg-icon';
import Sidebar from '../src';

export default {
  title: 'm-next/Components/Navigation/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
};

const fontFamily = "'Source Sans Pro', system-ui, -apple-system, sans-serif";

// Helper to render Method's SvgIcon in the sidebar's white-on-navy treatment.
const Glyph = ({ name }) => <SvgIcon name={name} size={20} color='white' />;

// Method's official wordmark logo — SVG path lifted directly from
// MethodUI/desktopShell/leftNav/components/HeaderLogo.js. Drawn in white
// to match production's color: ${base.colors['white']} styling.
const METHOD_WORDMARK_PATH =
  'M27.7748811,18.9435 L27.7748811,12.43125 C27.7748811,8.04525 25.768951,6.11025 22.2585734,6.11025 C19.5970909,6.11025 17.4174545,7.662 16.530042,9.57675 L16.4718881,9.57675 C15.7393007,7.278 14.0996643,6.129 11.5537343,6.129 C8.91113287,6.129 6.9052028,7.8525 6.11446154,9.57675 L6.05630769,9.57675 C6.05630769,9.57675 6.17186014,9.1935 6.17186014,8.82975 L6.17186014,8.33175 C6.17186014,7.1445 5.36148252,6.51225 3.87667133,6.51225 L0,6.51225 L0,9.96 L1.33074126,9.96 C1.79370629,9.96 2.12148252,10.2285 2.12148252,10.7265 L2.12148252,23.1765 L6.17186014,23.1765 L6.17186014,15.82125 C6.17186014,15.07425 6.28741259,14.385 6.46111888,13.73325 C6.98223776,11.607 8.37037762,9.864 10.4926154,9.864 C12.4985455,9.864 12.7296503,11.39625 12.7296503,13.197 L12.7296503,23.157 L16.9733706,23.157 L16.9733706,15.82125 C16.9733706,15.036 17.0504056,14.34675 17.2437483,13.695 C17.7067133,11.607 19.1726434,9.864 21.2367273,9.864 C23.1845035,9.864 23.5319161,11.30025 23.5319161,13.197 L23.5319161,20.916 C23.5319161,22.4865 24.2456224,23.157 25.8271049,23.157 L29.7037762,23.157 L29.7037762,19.70925 L28.4885874,19.70925 C28.0256224,19.72875 27.7748811,19.4025 27.7748811,18.94275 L27.7748811,18.9435 Z M37.5152727,6.072 C32.4808112,6.072 28.9704336,9.67275 28.9704336,14.8065 C28.9704336,19.557 32.4226573,23.541 37.9971189,23.541 C42.1826853,23.541 44.7482517,21.01275 44.7482517,21.01275 L42.9930629,18.1395 C42.9930629,18.1395 40.9871329,19.99725 38.2871329,19.99725 C35.7412028,19.99725 33.5812028,18.369 33.2526713,15.49575 L44.8449231,15.49575 C44.8449231,15.49575 44.9415944,14.4615 44.9415944,13.9635 C44.9612308,9.5775 42.3375105,6.072 37.516028,6.072 L37.5152727,6.072 Z M33.4067413,12.642 C33.8697063,10.53525 35.393035,9.27075 37.5341538,9.27075 C39.2508252,9.27075 40.6397203,10.7265 40.6971189,12.642 L33.405986,12.642 L33.4067413,12.642 Z M50.7275245,16.51125 L50.7275245,9.76875 L54.5853147,9.76875 L54.5853147,6.51225 L50.7275245,6.51225 L50.7275245,0 L46.6771469,0 L46.6771469,6.51225 L44.3623217,6.51225 L44.3623217,9.76875 L46.6771469,9.76875 L46.6771469,17.0475 C46.6771469,22.64025 51.3256783,23.33025 53.679021,23.33025 C54.4312448,23.33025 54.9712448,23.23425 54.9712448,23.23425 L54.9712448,19.59525 C54.9712448,19.59525 54.604951,19.653 54.141986,19.653 C52.984951,19.653 50.7282797,19.26975 50.7282797,16.512 L50.7275245,16.51125 Z M71.7512727,18.9435 L71.7512727,12.43125 C71.7512727,8.007 69.6486713,6.0915 65.8875524,6.0915 C62.9942098,6.0915 60.9112448,7.87275 60.1205035,9.405 L60.0623497,9.405 C60.0623497,9.405 60.1779021,8.811 60.1779021,7.9875 L60.1779021,2.1075 C60.1779021,0.594 59.4453147,0.00075 57.8827133,0.00075 L53.8126993,0.00075 L53.8126993,3.4485 L55.2204755,3.4485 C55.6834406,3.4485 55.9341818,3.678 55.9341818,4.17675 L55.9341818,23.17725 L60.1771469,23.17725 L60.1771469,15.4965 C60.1771469,14.71125 60.2156643,13.983 60.4082517,13.332 C61.0252867,11.30175 62.7804755,9.8655 64.9986294,9.8655 C67.1012308,9.8655 67.6986294,11.24475 67.6986294,13.275 L67.6986294,20.93625 C67.6986294,22.50675 68.2582657,23.17725 69.8201119,23.17725 L73.8704895,23.17725 L73.8704895,19.7295 L72.4815944,19.7295 C72.0186294,19.7295 71.749007,19.404 71.749007,18.94425 L71.7512727,18.9435 Z M106.064308,19.72875 C105.601343,19.72875 105.312084,19.40325 105.312084,18.9435 L105.312084,2.14575 C105.312084,0.6135 104.656531,0.00075 103.113566,0.00075 L99.1402238,0.00075 L99.1402238,3.4485 L100.432448,3.4485 C100.895413,3.4485 101.069119,3.678 101.069119,4.17675 L101.069119,7.1265 L101.107636,7.1265 C99.6228252,6.207 97.8668811,5.69025 95.9191049,5.69025 C90.7690909,5.69025 86.6998322,9.291 86.6998322,14.42475 L86.6998322,14.42475 C86.6998322,17.5275 84.4235245,19.635 81.685007,19.635 C78.985007,19.635 76.7086993,17.547 76.7086993,14.42475 C76.7086993,11.34075 78.7146294,9.2145 81.4146294,9.2145 L81.4342657,9.2145 C83.1894545,9.2145 85.0027972,10.1145 85.8894545,11.58975 C86.5064895,9.5595 86.9309371,8.8695 87.7987133,7.8165 C86.1787133,6.43725 84.0957483,5.748 81.6653706,5.748 L81.6457343,5.748 C76.5923916,5.748 72.5223776,9.34875 72.5223776,14.44425 C72.5223776,19.57725 76.6112727,23.15925 81.7227692,23.15925 C86.8727832,23.15925 90.942042,19.5585 90.942042,14.406 L90.942042,14.406 C90.942042,11.30325 93.2183497,9.19575 95.9568671,9.19575 C98.6568671,9.19575 100.933175,11.28375 100.933175,14.406 C100.933175,17.49 98.6568671,19.61625 95.9568671,19.61625 L95.9568671,19.61625 C94.2016783,19.61625 92.6390769,18.71625 91.7327832,17.241 C91.1157483,19.27125 90.6913007,19.9995 89.8235245,21.0525 C91.4435245,22.43175 93.5264895,23.1405 95.9568671,23.1405 L95.9568671,23.1405 C98.020951,23.1405 99.8916923,22.5465 101.415021,21.51225 L101.415021,21.53175 C101.415021,22.50825 101.974657,23.16 103.497986,23.16 L107.432811,23.16 L107.432811,19.71225 L106.063552,19.71225 L106.064308,19.72875 Z';

const MethodWordmark = () => (
  <svg width='108' height='24' viewBox='0 0 108 24' xmlns='http://www.w3.org/2000/svg' aria-label='method'>
    <path d={METHOD_WORDMARK_PATH} fill='currentColor' />
  </svg>
);

// A frame that gives the sidebar a realistic viewport context.
const Frame = ({ children }) => (
  <div style={{ display: 'flex', height: '100vh', fontFamily }}>
    {children}
    <main
      style={{
        flex: 1,
        padding: 24,
        background: '#FFFFFF',
        color: '#1F2A33',
        overflow: 'auto',
      }}
    >
      <h1 style={{ marginTop: 0 }}>Page content</h1>
      <p>The sidebar sits to the left.</p>
    </main>
  </div>
);

// =====================================================================
// Method-style (matches production LeftNav)
// =====================================================================
//
// Flat app list with two pinned items at the top (Home, App Studio),
// separated by Sidebar.Divider, then the scrollable app list. Icons come
// from @m-next/svg-icon — the same set production uses.

export const MethodStyle = () => (
  <Frame>
    <Sidebar>
      <Sidebar.Header>
        <span style={{ color: '#fff', display: 'inline-flex' }}>
          <MethodWordmark />
        </span>
        <button
          type='button'
          aria-label='Toggle sidebar'
          style={{
            marginLeft: 'auto',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SvgIcon name='navbar' size={20} color='white' />
        </button>
      </Sidebar.Header>
      <Sidebar.Item icon={<Glyph name='dashboard' />} active>
        Home
      </Sidebar.Item>
      <Sidebar.Item icon={<Glyph name='customize' />}>App Studio</Sidebar.Item>
      <Sidebar.Divider />
      <Sidebar.Body>
        <Sidebar.Item icon={<Glyph name='opportunity' />}>Opportunities</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='activities' />}>Activities</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='contacts' />}>PawWalk</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='contacts' />}>Contacts</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='edit' />}>Web to Lead</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='invoice' />}>Invoices</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='estimate' />}>Estimates</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='receipts' />}>Sales Receipts</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='payments' />}>Payments</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='items-shelf' />}>Items</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='building' />}>Accounts</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='salesrep-male' />}>Sales Reps</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='class-category' />}>Classes</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='payment-terms' />}>Terms</Sidebar.Item>
        <Sidebar.Item icon={<Glyph name='email' />}>Send Email</Sidebar.Item>
      </Sidebar.Body>
    </Sidebar>
  </Frame>
);
