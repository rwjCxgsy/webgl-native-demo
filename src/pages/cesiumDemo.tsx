
import ReactMarkdown from  'react-markdown'

import remarkGfm from 'remark-gfm'

import content from '../assets/test.md?raw'


export default function CesiumDemo() {

  return <div style={{overflow: 'auto', height: '100%'}}>
    <div style={{maxWidth: '720px', margin: '0 auto'}}>
      <ReactMarkdown remarkPlugins={[[remarkGfm, {singleTilde: false}]]}>{content}</ReactMarkdown>
    </div>
  </div>;
}
