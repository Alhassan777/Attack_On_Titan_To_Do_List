"""update task model

Revision ID: cbdb379de5f3
Revises: 81f827b507f1
Create Date: 2025-03-04 23:05:11.506860

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'cbdb379de5f3'
down_revision = '81f827b507f1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('task_hierarchy', schema=None) as batch_op:
        try:
            batch_op.drop_constraint('uq_task_hierarchy', type_='unique')
        except Exception:
            pass  # Constraint might not exist
        batch_op.create_unique_constraint('uq_task_hierarchy', ['ancestor', 'descendant'])

    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.drop_column('due_date')
        batch_op.drop_column('created_at')
        batch_op.drop_column('updated_at')

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('first_name',
               existing_type=sa.VARCHAR(length=50),
               type_=sa.String(length=40),
               existing_nullable=False)
        batch_op.alter_column('last_name',
               existing_type=sa.VARCHAR(length=50),
               type_=sa.String(length=40),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('last_name',
               existing_type=sa.String(length=40),
               type_=sa.VARCHAR(length=50),
               existing_nullable=False)
        batch_op.alter_column('first_name',
               existing_type=sa.String(length=40),
               type_=sa.VARCHAR(length=50),
               existing_nullable=False)

    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('updated_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('due_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))

    with op.batch_alter_table('task_hierarchy', schema=None) as batch_op:
        batch_op.drop_constraint('uq_task_hierarchy', type_='unique')

    # ### end Alembic commands ###
