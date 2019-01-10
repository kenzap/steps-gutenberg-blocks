const { __ } = wp.i18n; // Import __() from wp.i18n
const { Component, Fragment } = wp.element;
const { RichText, InspectorControls, PanelColorSettings, MediaUpload } = wp.editor;
const { RangeControl, PanelBody, Button } = wp.components;

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
    };

    /**
     * Add a new item to list with default fields
     */
    addItem = () => {
        key++;
        this.props.setAttributes( {
            items: [ ...this.props.attributes.items, {
                ...defaultItem,
                title: defaultItem.title + ' ' + ( key ),
                key: 'new ' + new Date().getTime(),
            } ],
        } );
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
                            label={ __( 'Description size', 'kenzap-steps' ) }
                            value={ attributes.descriptionSize }
                            onChange={ ( descriptionSize ) => setAttributes( { descriptionSize } ) }
                            min={ 10 }
                            max={ 130 }
                        />

                        <p style={ { marginBottom: '5px' } }>{ __( 'Underline image', 'kenzap-steps' ) }</p>
                        <MediaUpload
                            onSelect={ ( media ) => {
                                this.props.setAttributes( {
                                    icon: {
                                        iconMediaUrl: `url(${ media.url })`,
                                        iconMediaId: media.id,
                                    },
                                } );
                            } }
                            value={ attributes.icon.iconMediaId }
                            allowedTypes={ [ 'image' ] }
                            render={ ( mediaUploadProps ) => (
                                <Fragment>
                                    { attributes.icon.iconMediaUrl && attributes.icon.iconMediaUrl !== 'none' ? (
                                        <Fragment>
                                            <Button
                                                isDefault
                                                onClick={ () => {
                                                    setAttributes( {
                                                        icon: {
                                                            iconMediaId: '',
                                                            iconMediaUrl: 'none',
                                                        },
                                                    } );
                                                } }
                                            >
                                                { __( 'Remove', 'kenzap-steps' ) }
                                            </Button>
                                            <div
                                                style={ {
                                                    width: '27px',
                                                    height: '27px',
                                                    display: 'inline-block',
                                                    margin: '0 0 0 5px',
                                                    backgroundImage: attributes.icon.iconMediaUrl ? attributes.icon.iconMediaUrl : '',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize: 'cover',
                                                } }
                                            />
                                        </Fragment>
                                    ) : (
                                        <Button isDefault onClick={ mediaUploadProps.open }>
                                            { __( 'Upload/Choose', 'kenzap-steps' ) }
                                        </Button>
                                    ) }
                                </Fragment>

                            ) }
                        />
                        <p style={ { fontStyle: 'italic' } }>
                            { __( 'Override underline step image.', 'kenzap-steps' ) }
                        </p>

                        <PanelColorSettings
                            title={ __( 'Colors', 'kenzap-steps' ) }
                            initialOpen={ false }
                            colorSettings={ [
                                {
                                    value: attributes.textColor,
                                    onChange: ( value ) => {
                                        return setAttributes( { textColor: value } );
                                    },
                                    label: __( 'Text color', 'kenzap-steps' ),
                                },
                                {
                                    value: attributes.stepNumberColor,
                                    onChange: ( stepNumberColor ) => {
                                        return setAttributes( { stepNumberColor } );
                                    },
                                    label: __( 'Step number color', 'kenzap-steps' ),
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
                        className={ `kenzap-steps-3 block-${ attributes.blockUniqId } ${ isSelected ? 'selected' : '' } ` }
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
                                            className="step-box"
                                        >
                                            <button className="remove" onClick={ () => this.removeItem( index ) }>
                                                <span className="dashicons dashicons-no" />
                                            </button>

                                            <div className="kenzap-col-2">
                                                <div
                                                    className="step-count"
                                                >
                                                    <span style={ {
                                                        color: attributes.stepNumberColor,
                                                    } }>{ index + 1 }</span>
                                                </div>
                                            </div>
                                            <div className="kenzap-col-10">
                                                <div className="step-content">

                                                    <RichText
                                                        tagName="h3"
                                                        placeholder={ __( 'Title', 'kenzap-steps' ) }
                                                        value={ item.title }
                                                        onChange={ ( value ) => this.onChangePropertyItem( 'title', value, index, true ) }
                                                        style={ {
                                                            color: attributes.textColor,
                                                            fontSize: `${ attributes.titleSize }px`,
                                                            lineHeight: `${ attributes.titleSize * 1.3 }px`,
                                                        } }
                                                    />
                                                    <RichText
                                                        tagName="p"
                                                        placeholder={ __( 'Description', 'kenzap-steps' ) }
                                                        value={ item.description }
                                                        onChange={ ( value ) => this.onChangePropertyItem( 'description', value, index, true ) }
                                                        style={ {
                                                            color: attributes.textColor,
                                                            fontSize: `${ attributes.descriptionSize }px`,
                                                            lineHeight: `${ attributes.descriptionSize * 1.85 }px`,
                                                        } }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) ) }
                                </div>
                            </div>
                        </div>
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
