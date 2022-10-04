import React from 'react';

import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

import './styles/accordion.css';

const AccordionComponent = ({ accordionContent, name, preExpandedID }) => (
  <Accordion allowMultipleExpanded allowZeroExpanded={true} preExpanded={preExpandedID ? [preExpandedID] : []}>
    {accordionContent.map((content, i) => (
      <AccordionItem uuid={`${name}-${i}`} key={`${name}-${i}`}>
          <AccordionItemHeading>
              <AccordionItemButton>
                  {content.title}
              </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            {content.content}
          </AccordionItemPanel>
      </AccordionItem>
      ))
    }
  </Accordion>
);

export default AccordionComponent;
