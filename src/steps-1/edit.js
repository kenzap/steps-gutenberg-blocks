const { __ } = wp.i18n;
const { Component } = wp.element;
const { RichText, InspectorControls, PanelColorSettings, InnerBlocks } = wp.editor;
const { RangeControl, PanelBody } = wp.components;
import { defaultItem, typographyArr, getStyles } from './block';
import { InspectorContainer, ContainerEdit } from '../commonComponents/container/container';
import { TypographyContainer, getTypography } from '../commonComponents/typography/typography';
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
        if ( this.props.attributes.items.length >= 3 ) {
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

        const { vars, kenzapContanerStyles } = getStyles( attributes );
        return (
            <div>
                <InspectorControls>
                    <PanelBody
                        title={ __( 'General', 'kenzap-steps' ) }
                        initialOpen={ false }
                    >
                        <RangeControl
                            label={ __( 'Circle size', 'kenzap-steps' ) }
                            value={ attributes.titleSize }
                            onChange={ ( titleSize ) => setAttributes( { titleSize } ) }
                            min={ 10 }
                            max={ 60 }
                        />

                        <RangeControl
                            label={ __( 'Number size', 'kenzap-steps' ) }
                            value={ attributes.descriptionSize }
                            onChange={ ( descriptionSize ) => setAttributes( { descriptionSize } ) }
                            min={ 10 }
                            max={ 30 }
                        />
                                               
                    </PanelBody>

                    <PanelColorSettings
                        title={ __( 'Colors', 'kenzap-steps' ) }
                        initialOpen={ false }
                        colorSettings={ [
                            {
                                value: attributes.textColor2,
                                onChange: ( value ) => {
                                    return setAttributes( { textColor2: value } );
                                },
                                label: __( 'Circle background', 'kenzap-steps' ),
                            },
                            {
                                value: attributes.stepNumberColor,
                                onChange: ( stepNumberColor ) => {
                                    return setAttributes( { stepNumberColor } );
                                },
                                label: __( 'Circle text', 'kenzap-steps' ),
                            },
                        ] }
                    />

                    <TypographyContainer
                        setAttributes={ setAttributes }
                        typographyArr={ typographyArr }
                        { ...attributes }
                    />

                    <InspectorContainer
                        setAttributes={ setAttributes }
                        { ...attributes }
                        withNested
                        withPadding
                        withWidth100
                        withBackground
                        withAutoPadding
                    />
                </InspectorControls>
                <div className={ className ? className : '' } style={ vars }>
                    <ContainerEdit
                        className={ `kpst-1 block-${ attributes.blockUniqId } ${ isSelected ? 'selected' : '' } ` }
                        attributes={ attributes }
                        withBackground
                        withPadding
                    >
                        <div className="kenzap-container" style={ kenzapContanerStyles }>
                            { attributes.nestedBlocks == 'top' && <InnerBlocks /> }
                            <div className="step-list list-loaded">
                                <div className="kenzap-row">

                                    { attributes.items && attributes.items.map( ( item, index ) => (
                                        <div
                                            key={ item.key }
                                            className="kenzap-col-4"
                                        >
                                            <button className="remove" onClick={ () => this.removeItem( index ) }>
                                                <i className="dashicons dashicons-no" />
                                            </button>

                                            <div className="step-box">
                                                <div className="step-count" >
                                                    <span style={ { fontSize: `${ attributes.descriptionSize }px`, lineHeight: `${ attributes.titleSize }px`, width: `${ attributes.titleSize }px`, height: `${ attributes.titleSize }px` } } >{ index + 1 }</span>
                                                </div>
                                                <div className="step-content">

                                                    <RichText
                                                        tagName="h3"
                                                        placeholder={ __( 'Title', 'kenzap-steps' ) }
                                                        value={ item.title }
                                                        onChange={ ( value ) => this.onChangePropertyItem( 'title', value, index, true ) }
                                                        style={ getTypography( attributes, 0 ) }
                                                />
                                                    <RichText
                                                        tagName="p"
                                                        placeholder={ __( 'Description', 'kenzap-steps' ) }
                                                        value={ item.description }
                                                        onChange={ ( value ) => this.onChangePropertyItem( 'description', value, index, true ) }
                                                        style={ getTypography( attributes, 1 ) }
                                                />
                                                </div>
                                            </div>
                                        </div>
                                    ) ) }
                                </div>
                            </div>
                            { attributes.nestedBlocks == 'bottom' && <InnerBlocks /> }
                        </div>
                        { this.state.showError && <div className={ 'errorMessage errorShow' }>
                            { __( 'No more than 3 elements are allowed per block. Add new kenzap step 1 block.', 'kenzap-steps' ) }
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
