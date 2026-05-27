export function sanitizeHTMLLayout(designerHtmlLayout: string): string {
    const screenHTML = document.createElement('div');
    screenHTML.innerHTML = designerHtmlLayout;

    // Remove designer attributes and styles
    const sects = screenHTML.querySelectorAll('.mi-ds-Section');
    sects.forEach((sect) => {
        sect.classList.add('mi-Section');
        sect.classList.remove('mi-ds-Section', 'ui-draggable', 'objSelected', 'ui-draggable-disabled');
        sect.removeAttribute('aria-disabled');
        sect.removeAttribute('style');
    });

    screenHTML.querySelectorAll('.mi-ds-SectionHeader').forEach((header) => {
        header.classList.add('mi-SectionHeader');
        header.classList.remove('mi-ds-SectionHeader');
    });

    screenHTML.querySelectorAll('.mi-ds-SectionBody').forEach((body) => {
        body.classList.add('mi-SectionBody');
        body.classList.remove('mi-ds-SectionBody');
    });

    screenHTML.querySelectorAll('.tbl').forEach((tbl) => {
        tbl.classList.remove('ds_sectionTable');
    });

    screenHTML.querySelectorAll('.tblcell').forEach((cell) => {
        cell.classList.remove('ds_sectionCell', 'objSelected');
        const cellRtStyle = cell.getAttribute('cell-rt-style')?.trim();
        if (cellRtStyle) {
            cellRtStyle.split(' ').forEach((cls) => cell.classList.add(cls));
        }
    });

    screenHTML.querySelectorAll('.cellContainer').forEach((container) => {
        const children = Array.from(container.children);
        if (children.length === 0) {
            container.remove();
        } else {
            children.forEach((child) => container.parentNode?.insertBefore(child, container));
            container.remove();
        }
    });

    screenHTML.querySelectorAll('div *[style]').forEach((element) => {
        if (!element.classList.contains('tblcell')) {
            element.removeAttribute('style');
        }
    });

    // Cleanup controls
    screenHTML.querySelectorAll('.ds_control').forEach((control) => {
        if (control.getAttribute('data-remove')) {
            control.remove();
        } else {
            control.classList.add('control');
            control.classList.remove(
                'dragcursor', 'ds_control', 'objSelected', 'ui-draggable-disabled', 'ui-draggable-dragging',
                'ss-dragged-child', 'ui-state-disabled', 'ss-active-child', 'QBDesktop', 'QBOUSA'
            );
            control.removeAttribute('aria-disabled');
            control.removeAttribute('method_column_type');
            control.innerHTML = '';
        }
    });

    screenHTML.querySelectorAll('.ss-placeholder-child').forEach((placeholder) => {
        placeholder.remove();
    });

    // Cleanup sections
    sects.forEach((sect) => {
        const caption = sect.getAttribute('data-caption');
        const blnShowHeader = JSON.parse(sect.getAttribute('data-hasHeader') || 'false');
        const blnHideSection = JSON.parse(sect.getAttribute('data-isHidden') || 'false');
        const responsiveClass = sect.getAttribute('data-responsive');
        const blnCollapsed = JSON.parse(sect.getAttribute('data-collapsed') || 'false');
        const styling = sect.getAttribute('data-styling');
        const headerstyling = sect.getAttribute('data-headerStyling');
        const sectionwidth = sect.getAttribute('data-width');

        // Move design-time styles to data values
        sect.removeAttribute('data-caption');
        sect.removeAttribute('data-hasHeader');
        sect.removeAttribute('data-isHidden');
        sect.removeAttribute('data-responsive');
        sect.removeAttribute('data-collapsed');
        sect.removeAttribute('data-styling');
        sect.removeAttribute('data-headerStyling');
        sect.removeAttribute('data-width');
        sect.removeAttribute('data-isDisabled');

        // Header
        sect.classList.add(styling || '');
        const header = sect.querySelector('.mi-SectionHeader:first-child');
        if (header) {
            header.classList.remove('dragcursor');
            header.innerHTML = `<span class='mi-section-header-caption'>${caption}</span>`;
            header.classList.add(headerstyling || '');
            const collapsibleSpan = document.createElement('span');
            collapsibleSpan.classList.add('mi-section-collapsible');
            collapsibleSpan.innerHTML = "<i class='mi-icon-chevron-down'></i>";
            header.appendChild(collapsibleSpan);

            if (!blnShowHeader) {
                (header as HTMLElement).style.display = 'none';
            }
        }

        if (blnHideSection) {
            sect.classList.add('controlHide');
        }

        if (sectionwidth) {
            (sect as HTMLElement).style.width = `${sectionwidth} !important`;
        }

        // Responsive and fixed option
        let fixedClass = ' ';
        const cells = sect.querySelectorAll('.tblrow:first-child > *');
        cells.forEach((cell) => {
            if (cell.getAttribute('data-collapse') === 'true') {
                fixedClass = '';
            }
            if ((cell as HTMLElement).style.width) {
                fixedClass = ' tbl-fixed';
            }
        });

        const tbl = sect.querySelector('.tbl:first-child');
        if (tbl) {
            tbl.className = `tbl ${responsiveClass} ${fixedClass}`;
        }

        if (blnCollapsed) {
            const body = sect.querySelector('.mi-SectionBody:first-child');
            if (body) {
                (body as HTMLElement).style.display = 'none';
            }
            const icon = sect.querySelector('.mi-SectionHeader:first-child i');
            if (icon) {
                icon.classList.remove('mi-icon-chevron-down');
                icon.classList.add('mi-icon-chevron-right');
            }
        }
    });

    return screenHTML.innerHTML;
};