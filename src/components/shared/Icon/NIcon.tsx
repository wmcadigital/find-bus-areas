import React from 'react';
import dompurify from 'dompurify';
import Icon from './Icon';

const { sanitize } = dompurify;

const NIcon = ({ str }: { str: string }) => {
  return (
    <span className="wmnds-n-icon">
      <Icon
        className="wmnds-n-icon__svg"
        iconName="general-n-ticket"
        title="N-Network icon"
        desc="A hexagon with the letter 'n' inside of it."
      />
      {str}
    </span>
  );
};

export const ReplaceTextWithIcon = ({
  htmlElement,
  classNames,
}: {
  htmlElement: string;
  classNames?: string;
}) => {
  // Function to replace text with our icon
  const replaceTextWithIcon = (textNode: string, phraseToReplace: string) => {
    if (!textNode.toLowerCase().includes(phraseToReplace.toLowerCase())) return textNode; // If textNode doesn't include our matched text, then return

    // Otherwise...
    const textWithoutN = phraseToReplace.substring(1); // Chop the first character from our string (the 'n') as it will be replaced with an icon
    // HTML/SVG of icon we will use
    const svgIcon = `
    <svg class="wmnds-n-icon__svg" viewBox="0 0 119 114">
      <title>N-Network icon</title>
      <desc>A hexagon with the letter 'n' inside of it.</desc>
      <path d="M90.992 8a3.354 3.354 0 013.127 2.168L110.1 52.843a11.841 11.841 0 010 8.307l-15.79 42.16a3.354 3.354 0 01-3.126 2.167H27.668a3.354 3.354 0 01-3.127-2.168L8.752 61.15a11.842 11.842 0 010-8.306l15.982-42.675A3.354 3.354 0 0127.861 8h63.131m0-8H27.861c-4.728 0-8.96 2.934-10.618 7.362L1.26 50.037a19.843 19.843 0 000 13.918l15.79 42.16a11.339 11.339 0 0010.618 7.362h63.517c4.728 0 8.96-2.934 10.619-7.362l15.789-42.16a19.843 19.843 0 000-13.918L101.61 7.362A11.339 11.339 0 0090.992 0zM47.514 86.046H30.2V27.97h16.795v7.942c3.905-6.64 11.586-9.634 18.486-9.634 15.883 0 23.174 11.326 23.174 25.386v34.383H71.339V54.658c0-7.16-3.515-12.759-11.847-12.759-7.551 0-11.978 5.859-11.978 13.28v30.867z" fill-rule="nonzero"></path>
    </svg>`;
    // Then replace our found text with 'n' icon and text without 'n'
    const modifiedTextNode = textNode.replace(
      new RegExp(phraseToReplace, 'ig'),
      `<span class="wmnds-n-icon">${svgIcon}${textWithoutN}</span>`
    );

    return modifiedTextNode; // Return modified textNode back
  };

  function replacePhraseInHTML(htmlEle: string, phrase: string) {
    const phraseToReplace = phrase;
    const insideHTMLTags = new RegExp('(<.+?>|&\\w+;)'); // Get items within HTML </> tags
    const textNodes = htmlEle.split(insideHTMLTags).filter(Boolean); // Split on the HTML tags to avoid manipulating attributes etc.

    // Loop through textNodes and any that match 'insideHTMLTags', return straight away
    // Otherwise, that textNode is ready to be searched for our textToChange
    const updatedDOM = textNodes
      .map((DOMText) =>
        insideHTMLTags.test(DOMText) ? DOMText : replaceTextWithIcon(DOMText, phraseToReplace)
      )
      .join('');

    return updatedDOM;
  }

  // START HERE
  const phrasesToReplace = ['nNetwork', 'nTicket', 'nTrain', 'nBus']; // These are the phrases we want to replace the first char with the 'n' icon SVG (they are not case sensitive - we match on upper and lowercase with regex 'i' on line 17)
  let content = htmlElement;
  // Loop through each phrase and update the DOM body innerHTML with the replaced phrase
  phrasesToReplace.forEach((phraseToReplace) => {
    content = replacePhraseInHTML(content, phraseToReplace);
  });

  return (
    <span
      className={classNames}
      style={{ fontSize: 'inherit', lineHeight: 'inherit' }}
      dangerouslySetInnerHTML={{
        __html: sanitize(content),
      }}
    />
  );
};

export default NIcon;
