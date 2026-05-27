import React from 'react';
import PropTypes from 'prop-types';
import Container from '@m-next/container';
import { colors } from '@m-next/styles';
import GroupTypeSelector from './GroupTypeSelector';
import ReadOnlyPredicate from './ReadOnlyPredicate';

const propTypes = {
  fieldListOptions: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  controlList: PropTypes.instanceOf(Object),
  onPredicateDelete: PropTypes.func,
  onConnectorChange: PropTypes.func,
  onReadOnlyClick: PropTypes.func,
  displayPreferences: PropTypes.instanceOf(Object),
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  formattedExpression: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
};

const ExpressionGroup = ({
  displayPreferences,
  controlList,
  fieldList,
  fieldListOptions,
  onConnectorChange,
  onPredicateDelete,
  onReadOnlyClick,
  formattedExpression,
}) => {
  const { connector } = formattedExpression[0];
  return (
    <div key={formattedExpression[0].key} style={{ padding: '0px 16px' }}>
      <GroupTypeSelector
        id={0}
        key={`group-${formattedExpression[0].key}`}
        value={formattedExpression[0].connector}
        connector={null}
        readonly
        onChange={onConnectorChange}
        set={0}
      />
      <Container
        borderless
        key={`container-${formattedExpression[0].key}`}
        isRound={false}
        style={{
          gap: 8,
          padding: 0,
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          borderLeft: `2px solid ${colors['purple-light']}`,
          paddingLeft: 8,
          marginTop: 8,
        }}
      >
        {formattedExpression[0].expression.map((element, idx) => (
          <ReadOnlyPredicate
            id={`0-${idx}`}
            key={element.key}
            first={element.first}
            operation={element.operation}
            second={element.second}
            controlList={controlList}
            fieldList={fieldList}
            fieldListOptions={fieldListOptions}
            onDelete={onPredicateDelete}
            onClick={onReadOnlyClick}
            connector={idx === 0 ? null : 'And'}
            index={idx}
            set={0}
            displayPreferences={displayPreferences}
            ghost={element.ghost}
          />
        ))}

        {formattedExpression.length > 1 &&
          formattedExpression.map((set, setIndex) => {
            if (setIndex === 0) return null;
            return (
              <div key={set.key} style={{ paddingLeft: 8 }}>
                <GroupTypeSelector
                  id={setIndex}
                  key={`group-${set.key}`}
                  value={set.connector}
                  connector={setIndex > 0 ? connector : null}
                  readonly
                  onChange={onConnectorChange}
                  set={setIndex}
                />
                <Container
                  borderless
                  key={`container-${set.key}`}
                  isRound={false}
                  style={{
                    gap: 8,
                    padding: 0,
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    borderLeft: `2px solid ${colors.teal}`,
                    paddingLeft: 8,
                    marginTop: 8,
                  }}
                >
                  {set.expression.map((element, idx) => (
                    <ReadOnlyPredicate
                      id={`${setIndex}-${idx}`}
                      key={element.key}
                      first={element.first}
                      operation={element.operation}
                      second={element.second}
                      controlList={controlList}
                      fieldList={fieldList}
                      fieldListOptions={fieldListOptions}
                      onDelete={onPredicateDelete}
                      onClick={onReadOnlyClick}
                      connector={idx === 0 ? null : 'And'}
                      index={idx}
                      set={setIndex}
                      displayPreferences={displayPreferences}
                      ghost={element.ghost}
                    />
                  ))}
                </Container>
              </div>
            );
          })}
      </Container>
    </div>
  );
};

ExpressionGroup.propTypes = propTypes;
export default ExpressionGroup;
