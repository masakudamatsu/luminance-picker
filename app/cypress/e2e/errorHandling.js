import color from '../../theme/color';

describe('Error handling: missing input', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('By default, no error message is shown', () => {
    cy.findByTestId('colorCodeError').should('be.hidden');
  });

  it('Blurring without any input value DOES NOT show an error message.', () => {
    // execute
    cy.findByLabelText(/color code/i)
      .click()
      .blur();

    // verify
    cy.findByTestId('colorCodeError').should('be.hidden');
  });

  it('Clicking any hue swatch without any input value DOES show an error message, focus the color code field with its border in the alert color. But once entering text, the alert disappears.', () => {
    // execute
    cy.findByTestId('Red').click();
    // verify
    cy.findByTestId('colorCodeError').should('be.visible');
    cy.focused().should('have.attr', 'id', 'inputColorCode');
    cy.findByLabelText(/color code/i).should(
      'have.css',
      'border-color',
      color.paragraphErrorMessage.font.forLightColor,
    );

    // execute
    cy.findByLabelText(/color code/i).type('r');
    // verify
    cy.findByTestId('colorCodeError').should('be.hidden');
    cy.findByLabelText(/color code/i).should(
      'have.css',
      'border-color',
      color.body.font.lightMode,
    );
  });
});

describe('Error handling: invalid input', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('No error message is shown (with no change in border color) while entering text', () => {
    cy.findByLabelText(/color code/i)
      .click()
      .type('a');
    cy.findByTestId('colorCodeError').should('be.hidden');
    cy.findByLabelText(/color code/i).should(
      'have.css',
      'border-color',
      color.body.font.lightMode,
    );
  });

  it('Blurring with an invalid input shows an error message with the field box color in alert, but does not focus the input field', () => {
    cy.findByLabelText(/color code/i)
      .click()
      .type('a')
      .blur();
    cy.findByTestId('colorCodeError').should('be.visible');
    cy.findByLabelText(/color code/i).should(
      'have.css',
      'border-color',
      color.paragraphErrorMessage.font.forLightColor,
    );
    cy.focused().should('not.have.attr', 'id', 'inputColorCode');
  });

});