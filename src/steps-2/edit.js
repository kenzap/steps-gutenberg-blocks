const { __ } = wp.i18n; // Import __() from wp.i18n
const { Component } = wp.element;
const { RichText, InspectorControls, PanelColorSettings } = wp.editor;
const { RangeControl, PanelBody } = wp.components;

import { defaultItem, getStyles } from './block';

import { InspectorContainer, ContainerEdit } from '../commonComponents/container/container';
import { Plus } from '../commonComponents/icons/plus';

/**
 * Keys for new blocks
 * @type {number}
 */
let key = 0;

/**
 * The edit function describes the structure of your block in the context of the editor.
 * This represents what the editor will render when the block is used.
 *
 * The "edit" property must be a valid function.
 * @param {Object} props - attributes
 * @returns {Node} rendered component
 */
export default class Edit extends Component {
    state = {
        activeSubBlock: -1,
        showError: false,
    };

    timerId = 0;

    /**
     * Add a new item to list with default fields
     */
    addItem = () => {
        clearTimeout( this.timerId );
        if ( this.props.attributes.items.length >= 5 ) {
            this.setState( { showError: true } );
            this.timerId = setTimeout( () => {
                this.setState( { showError: false } );
                clearTimeout( this.timerId );
            }, 3000 );
        } else {
            key++;
            this.props.setAttributes( {
                items: [ ...this.props.attributes.items, {
                    ...defaultItem,
                    title: defaultItem.title + ' ' + ( key ),
                    key: 'new ' + new Date().getTime(),
                } ],
            } );
        }
    };

    /**
     * Change any property of item
     * @param {string} property - editable field
     * @param {string} value - for field
     * @param {number} index - of items array
     * @param {boolean} withMutation - in some cases we should avoid mutation for force rerender component
     */
    onChangePropertyItem = ( property, value, index, withMutation = false ) => {
        const items = withMutation ? [ ...this.props.attributes.items ] : this.props.attributes.items;
        if ( ! items[ index ] || typeof items[ index ][ property ] !== 'string' ) {
            return;
        }
        items[ index ][ property ] = value;
        this.props.setAttributes( { items: items } );
    };

    /**
     * Remove item
     * It also add default item if we remove all elements from array
     * @param {number} index - of item
     */
    removeItem = ( index ) => {
        const items = [ ...this.props.attributes.items ];
        if ( items.length === 1 ) {
            this.props.setAttributes( { items: [ defaultItem ] } );
        } else {
            items.splice( index, 1 );
            this.props.setAttributes( { items: items } );
        }
    };

    render() {
        const {
            className,
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        const { vars } = getStyles( attributes );
        return (
            <div>
                <InspectorControls>
                    <PanelBody
                        title={ __( 'General', 'kenzap-steps' ) }
                        initialOpen={ false }
                    >
                        <RangeControl
                            label={ __( 'Title size', 'kenzap-steps' ) }
                            value={ attributes.titleSize }
                            onChange={ ( titleSize ) => setAttributes( { titleSize } ) }
                            min={ 10 }
                            max={ 130 }
                        />
                        <RangeControl
                            label={ __( 'Number size', 'kenzap-steps' ) }
                            value={ attributes.numberSize }
                            onChange={ ( numberSize ) => setAttributes( { numberSize } ) }
                            min={ 10 }
                            max={ 130 }
                        />
                        <PanelColorSettings
                            title={ __( 'Colors', 'kenzap-steps' ) }
                            initialOpen={ false }
                            colorSettings={ [
                                {
                                    value: attributes.textColor,
                                    onChange: ( textColor ) => {
                                        return setAttributes( { textColor } );
                                    },
                                    label: __( 'Text color', 'kenzap-steps' ),
                                },
                                {
                                    value: attributes.arrowColor,
                                    onChange: ( arrowColor ) => {
                                        return setAttributes( { arrowColor } );
                                    },
                                    label: __( 'Arrow color', 'kenzap-steps' ),
                                },
                                {
                                    value: attributes.numberColor,
                                    onChange: ( numberColor ) => {
                                        return setAttributes( { numberColor } );
                                    },
                                    label: __( 'Number color', 'kenzap-steps' ),
                                },
                                {
                                    value: attributes.numberHoverColor,
                                    onChange: ( numberHoverColor ) => {
                                        return setAttributes( { numberHoverColor } );
                                    },
                                    label: __( 'Number hover color', 'kenzap-steps' ),
                                },
                                {
                                    value: attributes.roundCircleHoverColor,
                                    onChange: ( roundCircleHoverColor ) => {
                                        return setAttributes( { roundCircleHoverColor } );
                                    },
                                    label: __( 'Round circle hover color', 'kenzap-steps' ),
                                },
                            ] }
                        />
                    </PanelBody>
                    <InspectorContainer
                        setAttributes={ setAttributes }
                        { ...attributes }
                        withPadding
                        withWidth100
                        withBackground
                        withAutoPadding
                    />
                </InspectorControls>
                <div className={ className ? className : '' } style={ vars }>
                    <ContainerEdit
                        className={ `kenzap-steps-2 block-${ attributes.blockUniqId } ${ isSelected ? 'selected' : '' } ` }
                        attributes={ attributes }
                        withBackground
                        withPadding
                    >
                        <div className="kenzap-container">
                            <div className="step-list list-loaded">
                                <div className="kenzap-row">

                                    { attributes.items && attributes.items.map( ( item, index ) => (
                                        <div
                                            key={ item.key }
                                            className="kenzap-col-5th"
                                        >
                                            <button className="remove" onClick={ () => this.removeItem( index ) }>
                                                <span className="dashicons dashicons-no" />
                                            </button>

                                            <div className="step-box">
                                                <div
                                                    className="step-count"
                                                >
                                                    <span style={ { fontSize: `${ attributes.numberSize }px` } }>{ index + 1 }</span>
                                                </div>
                                                <div className="step-content">

                                                    <RichText
                                                        tagName="h3"
                                                        placeholder={ __( 'Title', 'kenzap-steps' ) }
                                                        value={ item.title }
                                                        onChange={ ( value ) => this.onChangePropertyItem( 'title', value, index, true ) }
                                                        style={ {
                                                        color: attributes.textColor,
                                                        fontSize: `${ attributes.titleSize }px`,
                                                    } }
                                                />
                                                </div>
                                            </div>
                                        </div>
                                    ) ) }
                                </div>
                            </div>
                        </div>
                        { this.state.showError && <div className={ 'errorMessage errorShow' }>
                            { __( 'The maximum count steps is 5. Please create a new kenzap step 2 block for new steps', 'kenzap-steps' ) }
                        </div>
                        }
                        <div className="editPadding" />
                        <button
                            className="addWhite"
                            onClick={ this.addItem }>
                            <span><Plus /></span>{ __( 'Add new step', 'kenzap-steps' ) }
                        </button>
                    </ContainerEdit>
                </div>
            </div>
        );
    }
}
