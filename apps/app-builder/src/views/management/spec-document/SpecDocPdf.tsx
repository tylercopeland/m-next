/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';
import { SpecDocumentContent } from '@m-next/api-interface';
import { colors } from '@m-next/styles';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors['blue-dark'],
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors['blue-dark'],
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: colors['grey-dark'],
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors['blue-dark'],
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors['grey-light'],
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors['grey-dark'],
    marginTop: 8,
    marginBottom: 5,
  },
  text: {
    fontSize: 10,
    color: colors['grey-dark'],
    marginBottom: 4,
    lineHeight: 1.4,
  },
  bold: {
    fontWeight: 'bold',
    color: colors['grey-darker'],
  },
  listItem: {
    fontSize: 9,
    color: colors['grey-dark'],
    marginLeft: 15,
    marginBottom: 3,
  },
  badge: {
    fontSize: 8,
    backgroundColor: colors['blue-light'],
    color: colors['blue-dark'],
    padding: '3 6',
    borderRadius: 3,
    marginRight: 5,
  },
  table: {
    marginTop: 5,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors['grey-light'],
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: colors['grey-light'],
    fontWeight: 'bold',
  },
  tableCol: {
    fontSize: 9,
    paddingHorizontal: 5,
  },
  infoBox: {
    backgroundColor: colors['grey-light'],
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors['blue'],
    marginVertical: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: colors['grey-light'],
    paddingTop: 10,
  },
});

interface Props {
  specContent: SpecDocumentContent
}

// PDF Document Component
export const SpecDocPDF = ({ specContent }: Props) => (
  <Document>
    {/* Cover Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{specContent.appName}</Text>
        <Text style={styles.subtitle}>Application Specification Document</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={[styles.text, styles.bold]}>Purpose:</Text>
        <Text style={styles.text}>{specContent.appPurpose}</Text>
      </View>

      <Text style={styles.footer}>
        Generated on {new Date().toLocaleDateString()} | {specContent.appName}
      </Text>
    </Page>

    {/* User Roles */}
    {specContent.userRoles && specContent.userRoles.length > 0 && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>User Roles</Text>
        {specContent.userRoles.map((role, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.subsectionTitle}>{role.name}</Text>
            <Text style={styles.text}>{role.description}</Text>
            {role.permissions && role.permissions.length > 0 && (
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.text, styles.bold]}>Permissions:</Text>
                {role.permissions.map((perm, i) => (
                  <Text key={i} style={styles.listItem}>• {perm}</Text>
                ))}
              </View>
            )}
          </View>
        ))}
        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} | {specContent.appName}
        </Text>
      </Page>
    )}

    {/* Key Workflows */}
    {specContent.keyWorkflows && specContent.keyWorkflows.length > 0 && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Key Workflows</Text>
        {specContent.keyWorkflows.map((workflow, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.subsectionTitle}>{workflow.name}</Text>
            <Text style={styles.text}>{workflow.description}</Text>
            
            {workflow.triggers && workflow.triggers.length > 0 && (
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.text, styles.bold]}>Triggers:</Text>
                {workflow.triggers.map((trigger, i) => (
                  <Text key={i} style={styles.listItem}>• {trigger}</Text>
                ))}
              </View>
            )}

            {workflow.steps && workflow.steps.length > 0 && (
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.text, styles.bold]}>Steps:</Text>
                {workflow.steps.map((step, i) => (
                  <Text key={i} style={styles.listItem}>{i + 1}. {step}</Text>
                ))}
              </View>
            )}
          </View>
        ))}
        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} | {specContent.appName}
        </Text>
      </Page>
    )}

    {/* Data Entities */}
    {specContent.dataEntities && specContent.dataEntities.length > 0 && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Data Entities</Text>
        {specContent.dataEntities.map((entity, idx) => (
          <View key={idx} style={styles.section} wrap={false}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3, gap: 5 }}>
              <Text style={styles.subsectionTitle}>{entity.tableName}</Text>
              <Text style={styles.badge}>{entity.source}</Text>
            </View>
            <Text style={styles.text}>{entity.description}</Text>
            
            {entity.fields && entity.fields.length > 0 && (
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCol, { width: '30%' }]}>Field</Text>
                  <Text style={[styles.tableCol, { width: '20%' }]}>Type</Text>
                  <Text style={[styles.tableCol, { width: '15%' }]}>Required</Text>
                  <Text style={[styles.tableCol, { width: '35%' }]}>Description</Text>
                </View>
                {entity.fields.map((field, i) => (
                  <View key={i} style={styles.tableRow}>
                    <Text style={[styles.tableCol, { width: '30%' }]}>{field.fieldName}</Text>
                    <Text style={[styles.tableCol, { width: '20%' }]}>{field.type}</Text>
                    <Text style={[styles.tableCol, { width: '15%' }]}>{field.required ? 'Yes' : 'No'}</Text>
                    <Text style={[styles.tableCol, { width: '35%' }]}>{field.description || '-'}</Text>
                  </View>
                ))}
              </View>
            )}

            {entity.relationships && entity.relationships.length > 0 && (
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.text, styles.bold]}>Relationships:</Text>
                {entity.relationships.map((rel, i) => (
                  <Text key={i} style={styles.listItem}>
                    • {rel.type} → {rel.relatedTable}: {rel.description}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} | {specContent.appName}
        </Text>
      </Page>
    )}

    {/* Business Rules */}
    {specContent.businessRules && specContent.businessRules.length > 0 && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Business Rules</Text>
        {specContent.businessRules.map((rule, idx) => (
          <View key={idx} style={styles.section} wrap={false}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3, gap: 5 }}>
              <Text style={styles.subsectionTitle}>{rule.name}</Text>
              <Text style={styles.badge}>{rule.priority}</Text>
            </View>
            <Text style={styles.text}>{rule.description}</Text>
            <View style={{ marginTop: 5 }}>
              <Text style={[styles.text, styles.bold]}>Condition: </Text>
              <Text style={styles.text}>{rule.condition}</Text>
              <Text style={[styles.text, styles.bold, { marginTop: 3 }]}>Action: </Text>
              <Text style={styles.text}>{rule.action}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} | {specContent.appName}
        </Text>
      </Page>
    )}

    {/* Screens */}
    {specContent.screens && specContent.screens.length > 0 && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Screens Overview</Text>
        {specContent.screens.map((screen, idx) => (
          <View key={idx} style={styles.section} wrap={false}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3, gap: 5 }}>
              <Text style={styles.subsectionTitle}>{screen.screenName}</Text>
              <Text style={styles.badge}>{screen.screenType}</Text>
              {screen.isStartingScreen && <Text style={styles.badge}>Starting Screen</Text>}
            </View>
            <Text style={styles.text}>{screen.purpose}</Text>
            <Text style={styles.text}>Base Table: {screen.baseTable}</Text>
            
            {screen.primaryWorkflows && screen.primaryWorkflows.length > 0 && (
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.text, styles.bold]}>Primary Workflows:</Text>
                {screen.primaryWorkflows.map((workflow, i) => (
                  <Text key={i} style={styles.listItem}>• {workflow}</Text>
                ))}
              </View>
            )}

            {screen.callToActions && screen.callToActions.length > 0 && (
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.text, styles.bold]}>Call to Actions:</Text>
                {screen.callToActions.map((cta, i) => (
                  <Text key={i} style={styles.listItem}>• {cta}</Text>
                ))}
              </View>
            )}

            {screen.controlsSummary && (
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.text, styles.bold]}>Controls: </Text>
                <Text style={styles.text}>{screen.controlsSummary}</Text>
              </View>
            )}
          </View>
        ))}
        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} | {specContent.appName}
        </Text>
      </Page>
    )}
  </Document>
);
